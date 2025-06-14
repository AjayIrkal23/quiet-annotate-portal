import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import QuizImage from "@/components/QuizImage";
import QuizOptions from "@/components/QuizOptions";
import QuizFeedback from "@/components/QuizFeedback";
import QuizSidebar from "@/components/QuizSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [{
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT
  }, setDims] = React.useState(getAnnotationDimensions());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [revealedBoxes, setRevealedBoxes] = useState({});
  const [answeredBoxes, setAnsweredBoxes] = useState({});
  const [quizForBox, setQuizForBox] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lockedUI, setLockedUI] = useState(false);
  const [allCorrectAnswered, setAllCorrectAnswered] = React.useState(false);
  // New: track per-box feedback for sidebar ("green"/"red")
  const [feedbackBoxes, setFeedbackBoxes] = React.useState<{
    [id: string]: "green" | "red" | undefined;
  }>({});
  // Responsive screen width
  const [screenW, setScreenW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    function handleResize() {
      setScreenW(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const imageUrl = dummyImages[currentImageIndex];
  const boundingBoxes = useSelector((state: RootState) => state.annotation.annotations[imageUrl] || []);
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
      label: wasCorrect ? "Correct!" : "Wrong, try again"
    });
    setFeedbackVisible(true);
    setAnsweredBoxes(prev => ({
      ...prev,
      [quizForBox.box.id]: true
    }));
    // Set sidebar feedback color
    setFeedbackBoxes(prev => ({
      ...prev,
      [quizForBox.box.id]: wasCorrect ? "green" : "red"
    }));
    setQuizForBox(null);
    if (wasCorrect) {
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: {
            y: 0.5
          }
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
      label: wasCorrect ? "Correct! No issues found!" : "Wrong! There actually are issues in this image."
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
      setAnsweredBoxes(Object.fromEntries(boundingBoxes.map(b => [b.id, true])));
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
          origin: {
            y: 0.5
          }
        });
      }, 200);
    }
  };

  // True if all boxes answered for this image OR allCorrectAnswered
  const canNext = boundingBoxes.length > 0 && Object.keys(answeredBoxes).length === boundingBoxes.length || boundingBoxes.length === 0 && allCorrectAnswered;
  const nextImage = () => {
    if (currentImageIndex < dummyImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const lastImage = currentImageIndex === dummyImages.length - 1;
  const firstImage = currentImageIndex === 0;
  const isMobile = screenW < 1024;
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      {/* Header (Title + Actions) */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-lg flex items-center justify-center">
              {/* User icon */}
              <span className="text-white text-lg font-bold">👤</span>
            </div>
            <div>
              <h1 className="font-bold  text-2xl text-white">
                User Annotation Quiz
              </h1>
              <p className="text-gray-400 text-sm">
                Try to guess the type of each bounding box
              </p>
            </div>
          </div>
          {/* Button actions match Annotation Studio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => handleAllCorrect(boundingBoxes.length === 0)} disabled={lockedUI} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-semibold transition-all w-full sm:w-auto" variant="default">
              Everything is correct in this image
            </Button>
            <Button onClick={nextImage} disabled={!canNext || lastImage} className={`flex items-center px-6 py-2 rounded-lg text-base font-semibold transition-all w-full sm:w-auto ${canNext && !lastImage ? "bg-green-500 hover:bg-green-600 text-white" : ""}`} variant={canNext && !lastImage ? "default" : "secondary"}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar - bounding boxes */}
        <div className="xl:w-80 w-full order-2 xl:order-1 mb-6 xl:mb-0">
          <QuizSidebar boundingBoxes={boundingBoxes} feedbackBoxes={feedbackBoxes} />
        </div>
        {/* Main Canvas - quiz image + options */}
        <div className="flex-1 order-1 xl:order-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h2 className="text-lg font-bold text-white">
                Image Quiz
              </h2>
              <div className="text-sm text-gray-400">
                Image {currentImageIndex + 1} of {dummyImages.length}
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={previousImage} disabled={firstImage} className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200" variant="secondary">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                {/* The Next button for navigation is only in header now */}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-600" style={{
              width: 900,
              height: 600
            }}>
                <QuizImage imageUrl={imageUrl} boundingBoxes={boundingBoxes} revealedBoxes={revealedBoxes} answeredBoxes={answeredBoxes} onBoxReveal={handleBoxReveal} imageDims={{
                width: 900,
                height: 600
              }} lockedUI={lockedUI} quizForBox={quizForBox} feedbackVisible={feedbackVisible} />
                <QuizOptions quizForBox={quizForBox} onAnswer={handleAnswer} lockedUI={lockedUI} />
                <QuizFeedback visible={feedbackVisible && feedback !== null} correct={!!feedback?.correct} onDismiss={() => {
                setFeedback(null);
                setFeedbackVisible(false);
                setLockedUI(false);
              }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Users;