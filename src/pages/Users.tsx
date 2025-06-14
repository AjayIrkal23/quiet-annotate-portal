
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// Consistent dummy images
const dummyImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop"
];

// Standardized image sizing, matching Annotation
const getAnnotationDimensions = () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // Use as MUCH space as possible, but maintain aspect ratio.
  // Assume target ratio ~4:3 (width:height)
  const MAX_WIDTH = Math.min(screenW - 64, 1152); // 64px: extra margin for very large screens
  const MAX_HEIGHT = Math.min(screenH - 112, 864); // 112px: extra vertical margins
  const ASPECT_RATIO = 4 / 3;
  let width = MAX_WIDTH, height = MAX_HEIGHT;
  if (width / height > ASPECT_RATIO) {
    width = height * ASPECT_RATIO;
  } else {
    height = width / ASPECT_RATIO;
  }
  // Tailwind: always round to even values to avoid layout gaps
  return { width: Math.round(width), height: Math.round(height) };
};

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

interface Issue {
  value: string;
  label: string;
  color: string;
}

const defaultIssues: Issue[] = [
  { value: "pothole", label: "Pothole", color: "#ef4444" },
  { value: "crack", label: "Road Crack", color: "#f97316" },
  { value: "debris", label: "Debris", color: "#eab308" },
  { value: "marking", label: "Missing Marking", color: "#3b82f6" },
  { value: "sign", label: "Damaged Sign", color: "#8b5cf6" },
  { value: "other", label: "Other Issue", color: "#6b7280" }
];

function getRandomOptions(correct: Issue, allIssues: Issue[]) {
  let options = allIssues.filter(i => i.value !== correct.value);
  options = options.sort(() => Math.random() - 0.5).slice(0, 3);
  options.push(correct);
  return options.sort(() => Math.random() - 0.5);
}

const Users: React.FC = () => {
  const [{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, setDims] = React.useState(getAnnotationDimensions());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [revealedBoxes, setRevealedBoxes] = useState<{ [id: string]: boolean }>({});
  const [answeredBoxes, setAnsweredBoxes] = useState<{ [id: string]: boolean }>({});
  const [quizForBox, setQuizForBox] = useState<{ box: BoundingBox; options: Issue[]; correct: Issue } | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; label: string } | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lockedUI, setLockedUI] = useState(false);

  // Responsive dimensions
  React.useEffect(() => {
    function handleResize() {
      setDims(getAnnotationDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageUrl = dummyImages[currentImageIndex];
  const boundingBoxes: BoundingBox[] = useSelector(
    (state: RootState) => state.annotation.annotations[imageUrl] || []
  );
  const issues: Issue[] = defaultIssues;

  // Reset state on new image
  React.useEffect(() => {
    setRevealedBoxes({});
    setAnsweredBoxes({});
    setQuizForBox(null);
    setFeedback(null);
    setFeedbackVisible(false);
    setLockedUI(false);
  }, [currentImageIndex, imageUrl]);

  // Click on image to try to reveal a bounding box
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lockedUI || quizForBox || feedbackVisible) return;

    // Get click coordinates relative to image
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find a non-revealed, non-answered bounding box containing this point
    const hiddenBox = boundingBoxes.find(
      (box) =>
        !answeredBoxes[box.id] &&
        !revealedBoxes[box.id] &&
        pointInBox(clickX, clickY, box)
    );
    if (hiddenBox) {
      setRevealedBoxes(prev => ({ ...prev, [hiddenBox.id]: true }));
      const correctIssue = issues.find(i => i.value === hiddenBox.issue)!;
      setQuizForBox({
        box: hiddenBox,
        options: getRandomOptions(correctIssue, issues),
        correct: correctIssue,
      });
    }
  };

  function pointInBox(x: number, y: number, box: BoundingBox) {
    const left = Math.min(box.x, box.x + box.width);
    const top = Math.min(box.y, box.y + box.height);
    const right = Math.max(box.x, box.x + box.width);
    const bottom = Math.max(box.y, box.y + box.height);
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  const handleAnswer = (sel: Issue) => {
    if (!quizForBox) return;
    const wasCorrect = sel.value === quizForBox.correct.value;
    setLockedUI(true);
    setFeedback({
      correct: wasCorrect,
      label: wasCorrect ? "Correct!" : "Wrong, try again",
    });
    setFeedbackVisible(true);
    setAnsweredBoxes((prev) => ({
      ...prev,
      [quizForBox.box.id]: true,
    }));
    setQuizForBox(null);

    if (wasCorrect) {
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.5 }
        });
      }, 200);
    }

    // Hide feedback after 1s, or dismiss on click
    const timeout = setTimeout(() => {
      setFeedback(null);
      setFeedbackVisible(false);
      setLockedUI(false);
    }, 1000);

    const handleClick = () => {
      clearTimeout(timeout);
      setFeedback(null);
      setFeedbackVisible(false);
      setLockedUI(false);
      window.removeEventListener('mousedown', handleClick, true);
    };
    window.addEventListener('mousedown', handleClick, true);
  };

  // Must answer all boxes to enable next
  const canNext =
    boundingBoxes.length > 0 &&
    Object.keys(answeredBoxes).length === boundingBoxes.length;

  const nextImage = () => {
    if (currentImageIndex < dummyImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{ padding: 0 }} // remove excess padding
    >
      <div
        className="relative w-full flex flex-col items-center justify-center"
        style={{
          maxWidth: IMAGE_WIDTH + 64, // 32px margin both sides
          minHeight: IMAGE_HEIGHT + 80, // for controls and text
          margin: 0,
        }}
      >
        <div className="mb-3 w-full flex flex-row items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent">
            User Annotation Quiz
          </h1>
          <div className="text-sm text-gray-400">
            Image {currentImageIndex + 1} of {dummyImages.length}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="relative"
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              boxShadow: "0 2px 32px 0 rgb(0 0 0 / 30%)",
              borderRadius: 18,
            }}
            onClick={handleImageClick}
            tabIndex={0}
          >
            <img
              src={dummyImages[currentImageIndex]}
              alt="Quiz visual"
              draggable={false}
              className="absolute w-full h-full rounded-xl border border-gray-600 object-cover"
              style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
            />

            {/* Only show a revealed/answered bounding box with NO name */}
            {boundingBoxes.map(
              (box) =>
                (revealedBoxes[box.id] || answeredBoxes[box.id]) && (
                  <div
                    key={box.id}
                    className="absolute transition-opacity duration-150"
                    style={{
                      left: Math.min(box.x, box.x + box.width),
                      top: Math.min(box.y, box.y + box.height),
                      width: Math.abs(box.width),
                      height: Math.abs(box.height),
                      border: answeredBoxes[box.id]
                        ? "3px solid #22c55e"
                        : "3px solid #3b82f6",
                      borderRadius: 8,
                      background: answeredBoxes[box.id]
                        ? "rgba(34,197,94,0.10)"
                        : "rgba(59,130,246,0.09)",
                      zIndex: 20,
                      pointerEvents: "none",
                    }}
                  />
                )
            )}

            {/* Pop options on revealed box */}
            {quizForBox && (
              <div className="absolute z-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl border border-gray-700 shadow-xl p-6 flex flex-col items-center gap-5 animate-fade-in">
                <div className="mb-3 text-white text-lg font-semibold">
                  What's the issue?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quizForBox.options.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="outline"
                      className="px-6 py-2 text-base font-medium"
                      onClick={() => handleAnswer(opt)}
                      disabled={lockedUI}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedbackVisible && feedback && (
              <div
                className={`absolute z-50 left-1/2 top-[20%] -translate-x-1/2 bg-gray-800 px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-fade-in ${
                  feedback.correct ? "border-green-500" : "border-red-500"
                }`}
                style={{ cursor: "pointer" }}
              >
                {feedback.correct ? (
                  <>
                    <Check className="text-green-400 w-7 h-7" />
                    <span className="font-bold text-green-300 text-xl">
                      Correct!
                    </span>
                  </>
                ) : (
                  <>
                    <X className="text-red-400 w-7 h-7" />
                    <span className="font-bold text-red-300 text-xl">
                      Wrong, try again
                    </span>
                  </>
                )}
                <span className="ml-3 text-gray-400 text-xs">(click to dismiss)</span>
              </div>
            )}

            {/* Block overlay while not finished */}
            {!canNext && boundingBoxes.length > 0 && (
              <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none" />
            )}

            {/* No boxes available */}
            {boundingBoxes.length === 0 && (
              <div className="absolute z-20 w-full h-full flex flex-col items-center justify-center bg-black/60 rounded-xl animate-fade-in">
                <div className="text-white text-xl font-semibold mb-2">
                  No bounding boxes for this image.
                </div>
                <div className="text-gray-300 text-sm">
                  Nothing to annotate.
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Next button */}
        <div className="flex justify-end mt-6 w-full px-6">
          <Button
            onClick={nextImage}
            disabled={!canNext || currentImageIndex === dummyImages.length - 1}
            className="px-6 py-2 rounded-lg text-lg"
            variant="default"
          >
            Next Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;

