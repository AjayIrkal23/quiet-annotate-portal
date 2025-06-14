import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { saveAnnotationForImage } from "../store/annotationSlice";
import { v4 as uuidv4 } from 'uuid';
import { Issue, BoundingBox, CurrentBox } from "@/types/annotationTypes";

export const defaultIssues: Issue[] = [
  { value: "pothole", label: "Pothole", color: "#ef4444" },
  { value: "crack", label: "Road Crack", color: "#f97316" },
  { value: "debris", label: "Debris", color: "#eab308" },
  { value: "marking", label: "Missing Marking", color: "#3b82f6" },
  { value: "sign", label: "Damaged Sign", color: "#8b5cf6" },
  { value: "other", label: "Other Issue", color: "#6b7280" },
];

// Dummy image URLs for annotation
export const dummyImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop",
];

function getAnnotationDimensions() {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // Use as MUCH space as possible, but maintain aspect ratio 4:3
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [issues, setIssues] = useState<Issue[]>(defaultIssues);
  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null); // shown in dialog before adding
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch();

  // Use useSelector to fetch the map of all annotations:
  const allAnnotations = useSelector(
    (state: RootState) => state.annotation.annotations
  );

  // Memoize boundingBoxes for current image
  const boundingBoxes: BoundingBox[] = useMemo(() => {
    const imageId = dummyImages[currentImageIndex];
    return allAnnotations[imageId] || [];
  }, [allAnnotations, currentImageIndex]);

  // Save boxes to redux
  const saveBoxesForCurrentImage = useCallback(
    (boxes: BoundingBox[]) => {
      if (!dummyImages || !dummyImages.length) return;
      const imageId = dummyImages[currentImageIndex];
      dispatch(
        saveAnnotationForImage({
          imageId,
          boxes,
        })
      );
    },
    [currentImageIndex, dispatch]
  );

  // Save pending box to redux if present
  const flushPendingBox = useCallback(() => {
    if (pendingBox && pendingBox.issue) {
      const imageId = dummyImages[currentImageIndex];
      const updatedBoxes = [...boundingBoxes, pendingBox];
      dispatch(
        saveAnnotationForImage({
          imageId,
          boxes: updatedBoxes,
        })
      );
      setPendingBox(null);
    }
  }, [pendingBox, boundingBoxes, currentImageIndex, dispatch]);

  // Save on component unmount
  useEffect(() => {
    return () => {
      saveBoxesForCurrentImage(boundingBoxes);
    };
  }, [saveBoxesForCurrentImage, boundingBoxes]);

  // useEffect to set dimensions on resize
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

  // Annotation logic
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
    // Box must have some size
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
      issue: "",
    };

    setPendingBox(newPendingBox);
    setCurrentBox(null);
    setIssueDialogOpen(true);
  };

  // Mouse event handlers
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

  // Save when going to next/prev image (flush pending first)
  const handleNextImage = () => {
    flushPendingBox();
    saveBoxesForCurrentImage(boundingBoxes);
    if (currentImageIndex < dummyImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    flushPendingBox();
    saveBoxesForCurrentImage(boundingBoxes);
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleGoToImage = (index: number) => {
    flushPendingBox();
    saveBoxesForCurrentImage(boundingBoxes);
    setCurrentImageIndex(index);
  };

  // Delete box
  const handleDeleteBoundingBox = (id: string) => {
    const imageId = dummyImages[currentImageIndex];
    const updatedBoxes = boundingBoxes.filter((box) => box.id !== id);
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
  };

  // ---- IssueDialog handlers ----
  const handleSelectIssue = (selectedIssue: string) => {
    if (!pendingBox) return;
    const boxWithIssue: BoundingBox = {
      ...pendingBox,
      issue: selectedIssue,
    };
    const updatedBoxes = [...boundingBoxes, boxWithIssue];
    saveBoxesForCurrentImage(updatedBoxes);

    setPendingBox(null);
    setIssueDialogOpen(false);
  };

  const handleAddIssue = (newIssue: Issue) => {
    setIssues((prev) => [...prev, newIssue]);
  };

  const handleRemoveIssue = (issueValue: string) => {
    // Prevent removal of built-in issues
    if (
      [
        "pothole", "crack", "debris", "marking", "sign", "other",
      ].includes(issueValue)
    )
      return;
    setIssues((prev) => prev.filter((i) => i.value !== issueValue));
  };

  const isMobile = IMAGE_WIDTH < 1024;

  return {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    currentImageIndex,
    setCurrentImageIndex,
    issues,
    setIssues,
    currentBox,
    setCurrentBox,
    pendingBox,
    setPendingBox,
    issueDialogOpen,
    setIssueDialogOpen,
    imageRef,
    canvasRef,
    boundingBoxes,
    startDrawing,
    updateDrawing,
    finishDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNextImage,
    handlePreviousImage,
    handleGoToImage,
    handleDeleteBoundingBox,
    handleSelectIssue,
    handleAddIssue,
    handleRemoveIssue,
    isMobile,
  };
}
