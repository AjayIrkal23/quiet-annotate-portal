import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { saveAnnotationForImage } from "../store/annotationSlice";
import { v4 as uuidv4 } from 'uuid';
import AnnotationCanvas from "@/components/AnnotationCanvas";
import AnnotationSidebar from "@/components/AnnotationSidebar";

interface Issue {
  value: string;
  label: string;
  color: string;
}

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

interface CurrentBox {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  issue?: string;
}

const dummyImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop",
];

const getAnnotationDimensions = () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // Use as MUCH space as possible, but maintain aspect ratio 4:3
  const MAX_WIDTH = Math.min(screenW - 64, 1152);
  const MAX_HEIGHT = Math.min(screenH - 112, 864);
  const ASPECT_RATIO = 4 / 3;

  let width = MAX_WIDTH,
    height = MAX_HEIGHT;

  if (width / height > ASPECT_RATIO) {
    width = height * ASPECT_RATIO;
  } else {
    height = width / ASPECT_RATIO;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

const defaultIssues = [
  { value: "pothole", label: "Pothole", color: "#ef4444" },
  { value: "crack", label: "Road Crack", color: "#f97316" },
  { value: "debris", label: "Debris", color: "#eab308" },
  { value: "marking", label: "Missing Marking", color: "#3b82f6" },
  { value: "sign", label: "Damaged Sign", color: "#8b5cf6" },
  { value: "other", label: "Other Issue", color: "#6b7280" },
];

const Annotation: React.FC = () => {
  const [{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, setDims] =
    useState(getAnnotationDimensions());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [issues, setIssues] = useState<Issue[]>(defaultIssues);
  const [currentBox, setCurrentBox] = useState<CurrentBox | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch();

  const boundingBoxes = useSelector(
    (state: RootState) =>
      state.annotation.annotations[dummyImages[currentImageIndex]] || []
  );

  // Function to save the current image boxes to redux
  const saveBoxesForCurrentImage = useCallback(() => {
    if (!dummyImages || !dummyImages.length) return;
    const imageId = dummyImages[currentImageIndex];
    dispatch(
      saveAnnotationForImage({
        imageId,
        boxes: boundingBoxes,
      })
    );
  }, [dummyImages, currentImageIndex, boundingBoxes, dispatch]);

  // Save when going to next image
  const handleNextImage = () => {
    saveBoxesForCurrentImage();
    if (currentImageIndex < dummyImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Save when going to previous image
  const handlePreviousImage = () => {
    saveBoxesForCurrentImage();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Save when jumping directly to any image (if applicable)
  const handleGoToImage = (index: number) => {
    saveBoxesForCurrentImage();
    setCurrentImageIndex(index);
  };

  // Save on component unmount
  useEffect(() => {
    return () => {
      saveBoxesForCurrentImage();
    };
  }, [saveBoxesForCurrentImage]);

  // useEffect to set dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDims(getAnnotationDimensions());
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it once to set initial dimensions

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startDrawing = (x: number, y: number) => {
    setCurrentBox({
      id: uuidv4(), // id is now in the type
      x,
      y,
      width: 0,
      height: 0,
      issue: issues[0].value,
    });
  };

  const updateDrawing = (x: number, y: number) => {
    setCurrentBox((prevBox) => {
      if (!prevBox) return prevBox;
      return {
        ...prevBox,
        width: x - prevBox.x,
        height: y - prevBox.y,
      };
    });
  };

  const finishDrawing = () => {
    if (!currentBox) return;

    // Basic validation: box must have some size
    if (Math.abs(currentBox.width!) < 5 || Math.abs(currentBox.height!) < 5) {
      setCurrentBox(null);
      return;
    }

    const newBox = {
      ...currentBox,
      width: currentBox.width!,
      height: currentBox.height!,
    } as BoundingBox;

    // Update Redux store with new bounding box
    const imageId = dummyImages[currentImageIndex];
    const updatedBoxes = [...boundingBoxes, newBox];
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));

    setCurrentBox(null); // Clear current box
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

  const handleDeleteBoundingBox = (id: string) => {
    const imageId = dummyImages[currentImageIndex];
    const updatedBoxes = boundingBoxes.filter((box) => box.id !== id);
    dispatch(saveAnnotationForImage({ imageId, boxes: updatedBoxes }));
  };

  // Instead, infer isMobile from IMAGE_WIDTH:
  const isMobile = IMAGE_WIDTH < 1024;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      {/* Header (Title + Instructions) */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-lg flex items-center justify-center">
              {/* Image icon */}
              <span className="text-white text-lg font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM6 16.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0-3.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm0-3.25a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div>
              <h1 className="font-bold  text-2xl text-white">
                Image Annotation
              </h1>
              <p className="text-gray-400 text-sm">
                Draw bounding boxes around issues in the image
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar - annotations + issues */}
        <div className="xl:w-80 w-full order-2 xl:order-1 mb-6 xl:mb-0">
          <AnnotationSidebar
            boundingBoxes={boundingBoxes}
            issues={issues}
            onDeleteBoundingBox={handleDeleteBoundingBox}
          />
        </div>

        {/* Main Canvas - image + drawing */}
        <div className="flex-1 order-1 xl:order-2">
          <AnnotationCanvas
            dummyImages={dummyImages}
            currentImageIndex={currentImageIndex}
            IMAGE_WIDTH={IMAGE_WIDTH}
            IMAGE_HEIGHT={IMAGE_HEIGHT}
            imageRef={imageRef}
            canvasRef={canvasRef}
            issues={issues}
            boundingBoxes={boundingBoxes}
            currentBox={currentBox}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onNextImage={handleNextImage}
            onPreviousImage={handlePreviousImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Annotation;
