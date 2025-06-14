
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// We'll use the same dummy images used in Annotation
const dummyImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop"
];

const getImageDimensions = () => {
  if (window.innerWidth >= 1536) { // 2xl screens
    return { width: 1000, height: 700 };
  } else if (window.innerWidth >= 1280) { // xl screens
    return { width: 900, height: 650 };
  } else if (window.innerWidth >= 1024) { // lg screens
    return { width: 800, height: 600 };
  } else {
    return { width: 700, height: 500 }; // default
  }
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

// For now, answers will be: correct is the actual issue, others are drawn from the set, randomized
// You may want to customize how the correct answer is determined or passed in future.
const defaultIssues: Issue[] = [
  { value: "pothole", label: "Pothole", color: "#ef4444" },
  { value: "crack", label: "Road Crack", color: "#f97316" },
  { value: "debris", label: "Debris", color: "#eab308" },
  { value: "marking", label: "Missing Marking", color: "#3b82f6" },
  { value: "sign", label: "Damaged Sign", color: "#8b5cf6" },
  { value: "other", label: "Other Issue", color: "#6b7280" }
];

function getRandomOptions(correct: Issue, allIssues: Issue[]) {
  // Pick 3 random issues, not including the correct
  let options = allIssues.filter(i => i.value !== correct.value);
  options = options.sort(() => Math.random() - 0.5).slice(0, 3);
  options.push(correct);
  return options.sort(() => Math.random() - 0.5);
}

const Users: React.FC = () => {
  // Only start from the first image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width: IMAGE_WIDTH, height: IMAGE_HEIGHT } = getImageDimensions();
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [answeredBoxes, setAnsweredBoxes] = useState<{ [id: string]: {answered: boolean, correct: boolean} }>({});
  const [showOptions, setShowOptions] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<Issue[]>([]);
  const [currentCorrect, setCurrentCorrect] = useState<Issue | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  // Fetch saved bounding boxes for current image
  const imageUrl = dummyImages[currentImageIndex];
  const boundingBoxes: BoundingBox[] = useSelector(
    (state: RootState) => state.annotation.annotations[imageUrl] || []
  );

  // Fetch issues list (for labels/colors)
  const issues: Issue[] = defaultIssues;

  // Handle clicking a box
  const onBoxClick = (box: BoundingBox) => {
    // Don't reopen answered
    if(answeredBoxes[box.id]?.answered) return;
    setActiveBoxId(box.id);
    const correctIssue = issues.find(i => i.value === box.issue)!;
    setCurrentCorrect(correctIssue);
    setCurrentOptions(getRandomOptions(correctIssue, issues));
    setShowOptions(true);
    setAnswerStatus(null);
  };

  // Handle answer click
  const handleAnswer = (sel: Issue) => {
    // If already answered, ignore
    if (!activeBoxId || answeredBoxes[activeBoxId]?.answered) return;
    const wasCorrect = sel.value === currentCorrect?.value;
    setAnsweredBoxes(prev => ({
      ...prev,
      [activeBoxId]: {answered: true, correct: wasCorrect}
    }));
    setAnswerStatus(wasCorrect ? "correct" : "wrong");
    setShowOptions(false);

    // Confetti for correct
    if(wasCorrect) {
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.5 }
        });
      }, 200);
    }
  };

  // Next image unlock only after all answered
  const canNext = boundingBoxes.length > 0 && Object.values(answeredBoxes).length === boundingBoxes.length;

  const nextImage = () => {
    setCurrentImageIndex((idx) => Math.min(dummyImages.length-1, idx+1));
    setAnsweredBoxes({});
    setActiveBoxId(null);
    setShowOptions(false);
    setAnswerStatus(null);
  };

  // Render overlay for clicked bounding box
  const renderBoxOverlay = (box: BoundingBox) => {
    const left = Math.min(box.x, box.x + box.width);
    const top = Math.min(box.y, box.y + box.height);
    const width = Math.abs(box.width);
    const height = Math.abs(box.height);
    return (
      <div
        className="absolute border-4 rounded-lg pointer-events-none z-20"
        style={{
          left, top, width, height,
          borderColor: issues.find(i => i.value === box.issue)?.color || "#ef4444",
          boxShadow: "0 0 0 4000px rgba(0,0,0,0.65)",
          background: "rgba(30,41,59,0.04)",
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl p-5 relative">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent">
              User Annotation Quiz
            </h1>
            <div className="text-sm text-gray-400">Image {currentImageIndex+1} of {dummyImages.length}</div>
          </div>
          <div className="flex justify-center">
            <div className="relative"
                 style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}>
                <img 
                  src={dummyImages[currentImageIndex]} 
                  alt="Quiz visual"
                  draggable={false}
                  className="absolute w-full h-full rounded-xl border border-gray-600 object-cover"
                  style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                />
                {/* Render overlays for answered box + current (highlight 'active' or 'wrong') */}
                {boundingBoxes.map(box =>
                  <div
                    key={box.id}
                    className="absolute transition-opacity duration-150"
                    style={{
                      left: Math.min(box.x, box.x + box.width),
                      top: Math.min(box.y, box.y + box.height),
                      width: Math.abs(box.width),
                      height: Math.abs(box.height),
                      border: answeredBoxes[box.id]?.answered
                        ? answeredBoxes[box.id].correct
                            ? "3px solid #22c55e"
                            : "3px solid #ef4444"
                        : "3px solid #3b82f6",
                      borderRadius: 8,
                      background: answeredBoxes[box.id]?.answered
                        ? answeredBoxes[box.id].correct
                            ? "rgba(34,197,94,0.08)"
                            : "rgba(239,68,68,0.08)"
                        : "rgba(59,130,246,0.08)",
                      cursor: (!answeredBoxes[box.id]?.answered && !showOptions) ? "pointer" : "default",
                      zIndex: activeBoxId === box.id ? 30 : 10
                    }}
                    onClick={() => (!answeredBoxes[box.id]?.answered && !showOptions) ? onBoxClick(box) : undefined}
                  >
                    {/* Label */}
                    <div className="absolute -top-8 left-0 bg-black/70 px-2 py-1 rounded text-xs font-medium text-white pointer-events-none">
                      {issues.find(i => i.value === box.issue)?.label || "Unknown"}
                    </div>
                  </div>
                )}

                {/* Overlay for clicked */}
                {activeBoxId && boundingBoxes.some(box=>box.id === activeBoxId) && renderBoxOverlay(
                  boundingBoxes.find(box=>box.id === activeBoxId)!
                )}

                {/* Pop options if active */}
                {showOptions && activeBoxId && (
                  <div
                    className="absolute z-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl border border-gray-700 shadow-xl p-6 flex flex-col items-center gap-5 animate-fade-in"
                  >
                    <div className="mb-3 text-white text-lg font-semibold">What's the issue?</div>
                    <div className="grid grid-cols-2 gap-3">
                      {currentOptions.map((opt) => (
                        <Button
                          key={opt.value}
                          variant="outline"
                          className="px-6 py-2 text-base font-medium"
                          onClick={() => handleAnswer(opt)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback: correct/wrong */}
                {answerStatus && (
                  <div className={`absolute z-50 left-1/2 top-[20%] -translate-x-1/2 bg-gray-800 px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-fade-in ${
                    answerStatus === "correct" ? "border-green-500" : "border-red-500"
                  }`}>
                    {answerStatus === "correct" ? (
                      <>
                        <Check className="text-green-400 w-7 h-7" />
                        <span className="font-bold text-green-300 text-xl">Correct!</span>
                      </>
                    ) : (
                      <>
                        <X className="text-red-400 w-7 h-7" />
                        <span className="font-bold text-red-300 text-xl">Wrong, try another</span>
                      </>
                    )}
                  </div>
                )}

                {/* Block overlay if unanswered */}
                {!canNext && boundingBoxes.length > 0 && (
                  <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none" />
                )}

                {/* If no boxes */}
                {boundingBoxes.length === 0 && (
                  <div className="absolute z-20 w-full h-full flex flex-col items-center justify-center bg-black/60 rounded-xl animate-fade-in">
                    <div className="text-white text-xl font-semibold mb-2">No bounding boxes for this image.</div>
                    <div className="text-gray-300 text-sm">Nothing to annotate.</div>
                  </div>
                )}
            </div>
          </div>

          {/* Next btn, enabled only when all answered */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={nextImage}
              disabled={!canNext || currentImageIndex === dummyImages.length-1}
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
