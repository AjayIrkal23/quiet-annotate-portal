
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { saveAnnotationForImage, submitAnnotations } from "../store/annotationSlice";
import { nextImage, previousImage } from "../store/imageSlice";
import { v4 as uuidv4 } from 'uuid';
import { BoundingBox, CurrentBox } from "@/types/annotationTypes";

// Fixed dimensions for consistent bounding boxes across all screens
const FIXED_IMAGE_WIDTH = 800;
const FIXED_IMAGE_HEIGHT = 600;

export function useAnnotationManager() {
  const dispatch = useDispatch();

  const { images, currentImageIndex } = useSelector((state: RootState) => state.image);
  const allAnnotations = useSelector((state: RootState) => state.annotation.annotations);

  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentImageData = images[currentImageIndex];
  const imageId = currentImageData?._id.$oid || '';
  const boundingBoxes: BoundingBox[] = allAnnotations[imageId] || [];

  const flushPendingBox = useCallback(() => {
    if (pendingBox && pendingBox.violationName) {
      const currentBoxes = allAnnotations[imageId] || [];
      const updatedBoxes = [...currentBoxes, pendingBox];
      dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
      setPendingBox(null);
    }
  }, [pendingBox, allAnnotations, imageId, dispatch]);

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

  const handleSubmitAnnotations = () => {
    const annotations = allAnnotations[imageId] || [];
    
    // Create the data structure you specified
    const submissionData = {
      imageName: currentImageData.imageName,
      imageSize: {
        width: FIXED_IMAGE_WIDTH,
        height: FIXED_IMAGE_HEIGHT
      },
      details: annotations.map(box => {
        const violation = currentImageData.violationDetails.find(v => v.name === box.violationName);
        return {
          violationName: box.violationName,
          description: violation?.description || '',
          boundingBox: {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height
          }
        };
      })
    };

    // Dummy function to simulate backend submission
    console.log('Submitting annotation data:', submissionData);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Annotation submitted successfully!');
      // You can add a toast notification here if needed
    }, 1000);

    // Still dispatch to Redux for state management
    dispatch(submitAnnotations({ imageId, annotations }));
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
    IMAGE_WIDTH: FIXED_IMAGE_WIDTH,
    IMAGE_HEIGHT: FIXED_IMAGE_HEIGHT,
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
