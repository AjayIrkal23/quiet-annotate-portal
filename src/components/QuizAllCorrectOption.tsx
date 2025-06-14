
import React from "react";
import { Button } from "@/components/ui/button";

interface QuizAllCorrectOptionProps {
  hasBoundingBoxes: boolean; // Are there actual bounding boxes for this image?
  lockedUI: boolean;
  onAllCorrect: (wasCorrect: boolean) => void;
}

const QuizAllCorrectOption: React.FC<QuizAllCorrectOptionProps> = ({
  hasBoundingBoxes,
  lockedUI,
  onAllCorrect
}) => {
  // Will be used for both cases: correct and wrong logic handled by parent
  return (
    <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-black/70 rounded-xl p-8 shadow-2xl animate-fade-in">
      <div className="text-white text-xl font-semibold mb-2">
        No issues found?
      </div>
      <Button
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-base rounded-lg font-semibold transition-all"
        disabled={lockedUI}
        onClick={() => {
          // If there are bounding boxes, this is wrong; otherwise, correct
          onAllCorrect(!hasBoundingBoxes);
        }}
        variant={hasBoundingBoxes ? "destructive" : "default"}
      >
        Everything is correct in this image
      </Button>
      <span className="mt-3 text-gray-300 text-xs">
        If you think there are <span className="font-bold">no issues</span> in this image, click above.
      </span>
    </div>
  );
};

export default QuizAllCorrectOption;
