
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { saveAnnotationForImage } from "../store/annotationSlice";
import { v4 as uuidv4 } from 'uuid';
import { ImageData, ViolationDetail, BoundingBox, CurrentBox } from "@/types/annotationTypes";
import { setCurrentImageIndex, nextImage, previousImage } from "../store/imageNavSlice";

// Mock data with the new structure
export const mockImageData: ImageData[] = [
  {
    _id: "68690639d912ec5777b86bc6",
    imagePath: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
    imageName: "Construction Site Safety Issue.jpeg",
    violationDetails: [
      {
        name: "Working at Height Without Fall Protection",
        description: "An individual is standing on top of a truck without any visible fall protection equipment.",
        severity: "high"
      },
      {
        name: "Lack of Personal Protective Equipment (PPE)",
        description: "Individuals are not wearing any visible personal protective equipment such as helmets or reflective clothing.",
        severity: "high"
      }
    ],
    createdAt: "2025-07-05T11:02:17.553Z",
    updatedAt: "2025-07-05T11:03:53.498Z"
  },
  {
    _id: "68690639d912ec5777b86bc7",
    imagePath: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
    imageName: "Road Safety Violations.jpeg",
    violationDetails: [
      {
        name: "Improper Traffic Control",
        description: "Work zone lacks proper traffic control signs and barriers.",
        severity: "medium"
      },
      {
        name: "Worker in Traffic Lane",
        description: "Workers are present in active traffic lanes without proper protection.",
        severity: "high"
      }
    ],
    createdAt: "2025-07-05T11:02:17.553Z",
    updatedAt: "2025-07-05T11:03:53.498Z"
  }
];

function getAnnotationDimensions() {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const MAX_WIDTH = Math.min(screenW - 64, 1152);
  const MAX_HEIGHT = Math.min(screenH - 112, 864);
  const ASPECT_RATIO = 4 / 3;

  let width = MAX_WIDTH, height = MAX_HEIGHT;

  if (width / height > ASPECT_RATIO) {
    width = height * ASPECT_RATIO;
  } else {
    height = width / ASPECT_RATIO;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

export function useAnnotationManager() {
  const [{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, setDims] =
    useState(getAnnotationDimensions());
  const dispatch = useDispatch();

  const currentImageIndex = useSelector(
    (state: RootState) => state.imageNav.currentImageIndex
  );

  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const allAnnotations = useSelector(
    (state: RootState) => state.annotation.annotations
  );

  const currentImageData = mockImageData[currentImageIndex];
  const imageId = currentImageData?._id || '';
  const boundingBoxes: BoundingBox[] = allAnnotations[imageId] || [];

  const flushPendingBox = useCallback(() => {
    if (pendingBox && pendingBox.violationName) {
      const currentBoxes = (allAnnotations && allAnnotations[imageId]) || [];
      const updatedBoxes = [...currentBoxes, pendingBox];
      dispatch(
        saveAnnotationForImage({
          imageId,
          boxes: updatedBoxes,
        })
      );
      setPendingBox(null);
    }
  }, [pendingBox, allAnnotations, imageId, dispatch]);

  useEffect(() => {
    return () => {
      if (pendingBox && pendingBox.violationName) {
        const currentBoxes = (allAnnotations && allAnnotations[imageId]) || [];
        const updatedBoxes = [...currentBoxes, pendingBox];
        dispatch(
          saveAnnotationForImage({
            imageId,
            boxes: updatedBoxes,
          })
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDims(getAnnotationDimensions());
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startDrawing = (x: number, y: number) => {
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
    if (!currentBox) return;
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
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateDrawing(x, y);
  };

  const handleMouseUp = () => {
    finishDrawing();
  };

  const handleNextImage = () => {
    flushPendingBox();
    dispatch(nextImage({ imagesLength: mockImageData.length }));
  };

  const handlePreviousImage = () => {
    flushPendingBox();
    dispatch(previousImage());
  };

  const handleDeleteBoundingBox = (id: string) => {
    const currentBoxes = (allAnnotations && allAnnotations[imageId]) || [];
    const updatedBoxes = currentBoxes.filter((box) => box.id !== id);
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
  };

  const handleSelectViolation = (selectedViolation: string) => {
    if (!pendingBox) return;
    const currentBoxes = (allAnnotations && allAnnotations[imageId]) || [];
    const boxWithViolation: BoundingBox = {
      ...pendingBox,
      violationName: selectedViolation,
    };
    const updatedBoxes = [...currentBoxes, boxWithViolation];
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));

    setPendingBox(null);
    setViolationDialogOpen(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#eab308';
      default: return '#6b7280';
    }
  };

  return {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    currentImageIndex,
    currentImageData,
    currentBox,
    pendingBox,
    violationDialogOpen,
    setViolationDialogOpen,
    imageRef,
    canvasRef,
    boundingBoxes,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNextImage,
    handlePreviousImage,
    handleDeleteBoundingBox,
    handleSelectViolation,
    getSeverityColor,
  };
}
