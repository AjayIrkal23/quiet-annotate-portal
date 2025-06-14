import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import QuizImage from "@/components/QuizImage";
import QuizOptions from "@/components/QuizOptions";
import QuizFeedback from "@/components/QuizFeedback";
import QuizAllCorrectOption from "@/components/QuizAllCorrectOption";
import QuizSidebar from "@/components/QuizSidebar";
const dummyImages = ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop"];
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
    height: Math.round(height)
  };
};
const defaultIssues = [{
  value: "pothole",
  label: "Pothole",
  color: "#ef4444"
}, {
  value: "crack",
  label: "Road Crack",
  color: "#f97316"
}, {
  value: "debris",
  label: "Debris",
  color: "#eab308"
}, {
  value: "marking",
  label: "Missing Marking",
  color: "#3b82f6"
}, {
  value: "sign",
  label: "Damaged Sign",
  color: "#8b5cf6"
}, {
  value: "other",
  label: "Other Issue",
  color: "#6b7280"
}];
function getRandomOptions(correct, allIssues) {
  let options = allIssues.filter(i => i.value !== correct.value);
  options = options.sort(() => Math.random() - 0.5).slice(0, 3);
  options.push(correct);
  return options.sort(() => Math.random() - 0.5);
}
const Users: React.FC = () => {
  const [{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, setDims] = React.useState(
    getAnnotationDimensions()
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [revealedBoxes, setRevealedBoxes] = useState({});
  const [answeredBoxes, setAnsweredBoxes] = useState({});
  const [quizForBox, setQuizForBox] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lockedUI, setLockedUI] = useState(false);
  const [allCorrectAnswered, setAllCorrectAnswered] = React.useState(false);
  // New: track per-box feedback for sidebar ("green"/"red")
  const [feedbackBoxes, setFeedbackBoxes] = React.useState<{ [id: string]: "green" | "red" | undefined }>({});

  React.useEffect(() => {
    function handleResize() {
      setDims(getAnnotationDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const imageUrl = dummyImages[currentImageIndex];
  const boundingBoxes = useSelector(
    (state: RootState) => state.annotation.annotations[imageUrl] || []
  );
  // Support custom issues defined for this image
  const allIssues = React.useMemo(() => {
    const labels = boundingBoxes.map(b => b.issue);
    return [...defaultIssues, ...labels.filter(val => defaultIssues.findIndex(def => def.value === val) === -1).map(val => ({
      value: val,
      label: val.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      color: "#f59e0b"
    }))];
  }, [boundingBoxes]);

  // Reset state on new image
  React.useEffect(() => {
    setRevealedBoxes({});
    setAnsweredBoxes({});
    setQuizForBox(null);
    setFeedback(null);
    setFeedbackVisible(false);
    setLockedUI(false);
    setAllCorrectAnswered(false);
    setFeedbackBoxes({}); // Reset sidebar feedback
  }, [currentImageIndex, imageUrl]);
  const handleBoxReveal = hiddenBox => {
    setRevealedBoxes(prev => ({
      ...prev,
      [hiddenBox.id]: true
    }));
    const correctIssue = allIssues.find(i => i.value === hiddenBox.issue) || {
      value: hiddenBox.issue,
      label: hiddenBox.issue.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      color: "#f59e0b"
    };
    setQuizForBox({
      box: hiddenBox,
      options: getRandomOptions(correctIssue, allIssues),
      correct: correctIssue
    });
  };
  const handleAnswer = sel => {
    if (!quizForBox) return;
    const wasCorrect = sel.value === quizForBox.correct.value;
    setLockedUI(true);
    setFeedback({
      correct: wasCorrect,
      label: wasCorrect ? "Correct!" : "Wrong, try again",
    });
    setFeedbackVisible(true);
    setAnsweredBoxes(prev => ({
      ...prev,
      [quizForBox.box.id]: true,
    }));
    // Set sidebar feedback color
    setFeedbackBoxes(prev => ({
      ...prev,
      [quizForBox.box.id]: wasCorrect ? "green" : "red",
    }));
    setQuizForBox(null);
    if (wasCorrect) {
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.5 },
        });
      }, 200);
    }

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
      window.removeEventListener("mousedown", handleClick, true);
    };
    window.addEventListener("mousedown", handleClick, true);
  };
  const handleAllCorrect = (wasCorrect: boolean) => {
    setLockedUI(true);
    setFeedback({
      correct: wasCorrect,
      label: wasCorrect
        ? "Correct! No issues found!"
        : "Wrong! There actually are issues in this image.",
    });
    setFeedbackVisible(true);
    setAllCorrectAnswered(true);
    setQuizForBox(null);

    // If user is wrong, mark all boxes as red in sidebar
    if (!wasCorrect && boundingBoxes.length > 0) {
      const newFeedback: any = {};
      for (const box of boundingBoxes) {
        newFeedback[box.id] = "red";
      }
      setFeedbackBoxes(newFeedback);
      setAnsweredBoxes(
        Object.fromEntries(boundingBoxes.map((b) => [b.id, true]))
      );
    }

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
      window.removeEventListener("mousedown", handleClick, true);
    };
    window.addEventListener("mousedown", handleClick, true);

    // If correct, optionally trigger confetti etc.
    if (wasCorrect) {
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 78,
          origin: { y: 0.5 },
        });
      }, 200);
    }
  };

  // True if all boxes answered for this image OR allCorrectAnswered
  const canNext =
    (boundingBoxes.length > 0 &&
      Object.keys(answeredBoxes).length === boundingBoxes.length) ||
    (boundingBoxes.length === 0 && allCorrectAnswered);

  const nextImage = () => {
    if (currentImageIndex < dummyImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // See if all the bounding boxes are processed for the last image
  const lastImage = currentImageIndex === dummyImages.length - 1;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div
        style={{
          maxWidth: IMAGE_WIDTH + 64,
          minHeight: IMAGE_HEIGHT + 80,
          margin: 0,
        }}
        className="relative w-full flex flex-col items-center justify-center mt-14"
      >
        <div className="mb-3 w-full flex flex-row items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent">
            User Annotation Quiz
          </h1>
          <div className="text-sm text-gray-400">
            Image {currentImageIndex + 1} of {dummyImages.length}
          </div>
        </div>
        <div className="flex flex-row w-full gap-5 items-start">
          <div className="flex-shrink-0 w-[260px]">
            <QuizSidebar
              boundingBoxes={boundingBoxes}
              feedbackBoxes={feedbackBoxes}
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full relative">
            <QuizImage
              imageUrl={imageUrl}
              boundingBoxes={boundingBoxes}
              revealedBoxes={revealedBoxes}
              answeredBoxes={answeredBoxes}
              onBoxReveal={handleBoxReveal}
              imageDims={{
                width: 900,
                height: 600,
              }}
              lockedUI={lockedUI}
              quizForBox={quizForBox}
              feedbackVisible={feedbackVisible}
            />

            <QuizOptions
              quizForBox={quizForBox}
              onAnswer={handleAnswer}
              lockedUI={lockedUI}
            />

            <QuizFeedback
              visible={feedbackVisible && feedback !== null}
              correct={!!feedback?.correct}
              onDismiss={() => {
                setFeedback(null);
                setFeedbackVisible(false);
                setLockedUI(false);
              }}
            />
          </div>
        </div>
        {/* Next + All Correct button row */}
        <div className="flex flex-row justify-end gap-3 mt-6 w-full px-6 items-center">
          <Button
            onClick={() =>
              handleAllCorrect(boundingBoxes.length === 0)
            }
            disabled={lockedUI}
            className="px-6 py-2 rounded-lg text-lg bg-blue-500 hover:bg-blue-600 text-white"
            variant="default"
          >
            Everything is correct in this image
          </Button>
          <Button
            onClick={nextImage}
            disabled={!canNext || lastImage}
            className={`px-6 py-2 rounded-lg text-lg
              ${canNext && !lastImage ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            `}
            variant={canNext && !lastImage ? "default" : "secondary"}
          >
            Next Image
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Users;
