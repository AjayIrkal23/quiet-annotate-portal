import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  saveAnnotationForImage,
  submitAnnotations,
} from "../store/annotationSlice";
import { nextImage, previousImage } from "../store/imageSlice";
import { v4 as uuidv4 } from "uuid";
import { BoundingBox, CurrentBox } from "@/types/annotationTypes";
import axios from "axios";
import { BASEURL } from "@/lib/utils";
import { fetchUniqueImages } from "./../store/thunks/fetchUniqueImages";

export function useAnnotationManager() {
  const dispatch = useDispatch();

  const { images, currentImageIndex } = useSelector(
    (state: RootState) => state.image
  );
  const allAnnotations = useSelector(
    (state: RootState) => state.annotation.annotations
  );

  useEffect(() => {
    dispatch<any>(fetchUniqueImages("AjayIrkal")); // Replace with dynamic employeeId if needed
  }, []);

  const [imageWidth] = useState(800);
  const [imageHeight] = useState(600);

  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentImageData = images[currentImageIndex];
  const imageId = currentImageData?._id || "";
  const boundingBoxes: BoundingBox[] = allAnnotations[imageId] || [];

  // Calculate total annotated images
  const totalAnnotatedImages = Object.keys(allAnnotations).filter(
    (imageId) => allAnnotations[imageId] && allAnnotations[imageId].length > 0
  ).length;

  // Get used violation names for current image
  const usedViolations = boundingBoxes?.map((box) => box?.violationName);

  // Check if all violations are annotated
  const allViolationsAnnotated = currentImageData
    ? currentImageData?.violationDetails?.length === boundingBoxes?.length
    : false;

  // Get available violations (not yet annotated)
  const availableViolations = currentImageData
    ? currentImageData?.violationDetails?.filter(
        (v) => !usedViolations?.includes(v.name)
      )
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
    if (!canvasRef.current || allViolationsAnnotated) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateDrawing(x, y);
  };

  const handleMouseUp = () => {
    if (allViolationsAnnotated) return;
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

  const handleSubmitAnnotations = async () => {
    const allImageData = images
      .map((image) => {
        const imageId = image._id;
        const annotations = allAnnotations[imageId] || [];

        if (annotations.length === 0) return null;

        return {
          employeeId: "AjayIrkal",
          imageName: image.imageName,
          imagePath: image.imagePath, // ✅ Add imagePath here
          imageSize: {
            width: imageWidth,
            height: imageHeight,
          },
          details: annotations.map((box) => {
            const violation = image.violationDetails.find(
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
            };
          }),
        };
      })
      .filter(Boolean); // Remove null entries

    if (allImageData.length === 0) {
      alert("⚠️ No annotations to submit.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASEURL}/anotatedImages/bulk`,
        allImageData
      );

      console.log("✅ API Response:", response.data);
      alert(
        `✅ ${response.data.created} images saved, ${response.data.skipped} skipped.`
      );

      dispatch<any>(fetchUniqueImages("AjayIrkal")); // Replace with dynamic employeeId if needed
    } catch (error) {
      console.error("❌ API error:", error);
      alert("❌ Failed to submit annotations. See console for details.");
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
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNextImage,
    handlePreviousImage,
    handleDeleteBoundingBox,
    handleSelectViolation,
    handleSubmitAnnotations,
    getSeverityColor,
  };
}
