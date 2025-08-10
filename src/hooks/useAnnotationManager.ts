import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  saveAnnotationForImage,
  submitAnnotations,
} from "../store/annotationSlice";
import { nextImage, previousImage } from "../store/imageSlice";
import { v4 as uuidv4 } from "uuid";
import {
  BoundingBox,
  CurrentBox,
  ViolationDetail,
} from "@/types/annotationTypes";
import axios from "axios";
import { BASEURL } from "@/lib/utils";
import { fetchUniqueImages } from "./../store/thunks/fetchUniqueImages";
import { toast } from "sonner";

export function useAnnotationManager() {
  const dispatch = useDispatch();
  const { images, currentImageIndex } = useSelector(
    (state: RootState) => state.image
  );
  const { profile } = useSelector((state: RootState) => state.user);
  const allAnnotations = useSelector(
    (state: RootState) => state.annotation.annotations
  );

  const employeeId = profile?.employeeId || "";

  useEffect(() => {
    if (employeeId) {
      dispatch<any>(fetchUniqueImages(employeeId));
    }
  }, [dispatch, employeeId]);

  const [imageWidth] = useState(800);
  const [imageHeight] = useState(600);
  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);
  
  // Zoom/magnifier state
  const [zoomActive, setZoomActive] = useState(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentImageData = images[currentImageIndex];
  const imageId = currentImageData?._id || "";
  const boundingBoxes: BoundingBox[] = allAnnotations[imageId] || [];

  // New: custom violations per image (session-only)
  const [customViolations, setCustomViolations] = useState<
    Record<string, ViolationDetail[]>
  >({});

  // Calculate total annotated images
  const totalAnnotatedImages = Object.keys(allAnnotations).filter(
    (imageId) => allAnnotations[imageId] && allAnnotations[imageId].length > 0
  ).length;

  // Extended violations for current image (base + custom)
  const baseViolations = currentImageData?.violationDetails || [];
  const extendedViolationDetails: ViolationDetail[] = currentImageData
    ? [...baseViolations, ...(customViolations[imageId] || [])]
    : [];

  // Get used violation names for current image
  const usedViolations = boundingBoxes?.map((box) => box?.violationName);

  // Check if all violations are annotated
  const allViolationsAnnotated = currentImageData
    ? extendedViolationDetails.length === boundingBoxes?.length
    : false;

  // Get available violations (not yet annotated)
  const availableViolations = currentImageData
    ? extendedViolationDetails.filter((v) => !usedViolations?.includes(v.name))
    : [];

  const flushPendingBox = useCallback(() => {
    if (pendingBox && pendingBox?.violationName) {
      const currentBoxes = allAnnotations[imageId] || [];
      const updatedBoxes = [...currentBoxes, pendingBox];
      dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
      setPendingBox(null);
    }
  }, [pendingBox, allAnnotations, imageId, dispatch]);

  const startDrawing = (x: number, y: number) => {
    // Don't allow drawing if all violations are annotated
    if (allViolationsAnnotated) return;
    setCurrentBox({
      id: uuidv4(),
      x,
      y,
      width: 0,
      height: 0,
    });
  };

  const updateDrawing = (x: number, y: number) => {
    setCurrentBox((prevBox) => {
      if (!prevBox) return prevBox;
      return {
        ...prevBox,
        width: x - prevBox.x!,
        height: y - prevBox.y!,
      };
    });
  };

  const finishDrawing = () => {
    if (!currentBox || allViolationsAnnotated) return;
    if (
      currentBox.width === undefined ||
      currentBox.height === undefined ||
      currentBox.x === undefined ||
      currentBox.y === undefined ||
      Math.abs(currentBox.width) < 5 ||
      Math.abs(currentBox.height) < 5
    ) {
      setCurrentBox(null);
      return;
    }
    const newPendingBox: BoundingBox = {
      id: currentBox.id || uuidv4(),
      x: currentBox.x,
      y: currentBox.y,
      width: currentBox.width,
      height: currentBox.height,
      violationName: "",
    };
    setPendingBox(newPendingBox);
    setCurrentBox(null);
    setViolationDialogOpen(true);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || allViolationsAnnotated) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || allViolationsAnnotated || !currentBox) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateDrawing(x, y);
  };

  const handleMouseUp = () => {
    if (allViolationsAnnotated) return;
    finishDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || allViolationsAnnotated) return;
    e.preventDefault(); // Prevent default touch behaviors like scrolling
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || allViolationsAnnotated || !currentBox) return;
    e.preventDefault(); // Prevent default touch behaviors
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    updateDrawing(x, y);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (allViolationsAnnotated) return;
    e.preventDefault(); // Prevent default touch behaviors
    finishDrawing();
  };

  const handleNextImage = () => {
    flushPendingBox();
    dispatch(nextImage());
  };

  const handlePreviousImage = () => {
    flushPendingBox();
    dispatch(previousImage());
  };

  const handleDeleteBoundingBox = (id: string) => {
    const currentBoxes = allAnnotations[imageId] || [];
    const updatedBoxes = currentBoxes.filter((box) => box.id !== id);
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
  };

  const handleSelectViolation = (selectedViolation: string) => {
    if (!pendingBox) return;
    const currentBoxes = allAnnotations[imageId] || [];
    const boxWithViolation: BoundingBox = {
      ...pendingBox,
      violationName: selectedViolation,
    };
    const updatedBoxes = [...currentBoxes, boxWithViolation];
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
    setPendingBox(null);
    setViolationDialogOpen(false);
  };

  // Add a custom violation for the current image (session-only)
  const addCustomViolation = (violation: ViolationDetail) => {
    if (!imageId) return;
    const existing = [
      ...(customViolations[imageId] || []),
      ...(currentImageData?.violationDetails || []),
    ];
    if (
      existing.some(
        (v) =>
          v.name.trim().toLowerCase() === violation.name.trim().toLowerCase()
      )
    ) {
      toast.error("Violation already exists for this image.", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
      return;
    }
    setCustomViolations((prev) => ({
      ...prev,
      [imageId]: [...(prev[imageId] || []), violation],
    }));
  };

  const handleSubmitAnnotations = async () => {
    const allImageData = images
      .map((image) => {
        const imageId = image._id as string;
        const annotations = allAnnotations[imageId] || [];
        if (annotations.length === 0) return null;

        const extendedForImage: ViolationDetail[] = [
          ...(image.violationDetails || []),
          ...((customViolations[imageId] as ViolationDetail[] | undefined) ||
            []),
        ];

        return {
          employeeId,
          imageName: image.imageName,
          imagePath: image.imagePath,
          imageSize: {
            width: imageWidth,
            height: imageHeight,
          },
          details: annotations.map((box: any) => {
            const violation = extendedForImage.find(
              (v) => v.name === box.violationName
            );
            return {
              violationName: box.violationName,
              description: violation?.description || "",
              boundingBox: {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
              },
              ...(box.isHumanAdded !== undefined
                ? { isHumanAdded: box.isHumanAdded }
                : violation?.isHumanAdded !== undefined
                ? { isHumanAdded: violation.isHumanAdded }
                : {}),
            };
          }),
        };
      })
      .filter(Boolean); // Remove null entries

    if (allImageData.length === 0) {
      toast.error("⚠️ No annotations to submit.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASEURL}/anotatedImages/bulk`,
        allImageData
      );
      console.log("✅ API Response:", response.data);
      toast.success(
        `${response.data.created} images saved, ${response.data.skipped} skipped.`,
        {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }
      );
      if (employeeId) {
        dispatch<any>(fetchUniqueImages(employeeId));
      }
    } catch (error) {
      console.error("❌ API error:", error);
      toast.error("❌ Failed to submit annotations. See console for details.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
    }

    // Clear all annotations after submission
    Object.keys(allAnnotations).forEach((imageId) => {
      if (allAnnotations[imageId]?.length > 0) {
        dispatch(
          submitAnnotations({ imageId, annotations: allAnnotations[imageId] })
        );
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "#b91c1c";
      case "high":
        return "#ef4444";
      case "medium":
        return "#f97316";
      case "low":
        return "#eab308";
      default:
        return "#6b7280";
    }
  };

  return {
    IMAGE_WIDTH: imageWidth,
    IMAGE_HEIGHT: imageHeight,
    currentImageIndex,
    currentImageData,
    currentBox,
    pendingBox,
    violationDialogOpen,
    setViolationDialogOpen,
    imageRef,
    canvasRef,
    boundingBoxes,
    totalImages: images.length,
    totalAnnotatedImages,
    allViolationsAnnotated,
    availableViolations,
    // New exposed data
    extendedViolationDetails,
    // Zoom state
    zoomActive,
    setZoomActive,
    lensPos,
    setLensPos,
    // Mouse/touch handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    // Navigation & actions
    handleNextImage,
    handlePreviousImage,
    handleDeleteBoundingBox,
    handleSelectViolation,
    handleSubmitAnnotations,
    getSeverityColor,
    // Add violation
    addCustomViolation,
  };
}
