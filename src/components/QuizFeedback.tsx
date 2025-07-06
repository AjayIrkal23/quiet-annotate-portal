
import React from "react";
import { Check, X } from "lucide-react";

interface QuizFeedbackProps {
  visible: boolean;
  correct: boolean;
  onDismiss: () => void;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  visible,
  correct,
  onDismiss,
}) => {
  if (!visible) return null;
  return (
    <div
      className={`absolute z-50 left-1/2 top-[20%] -translate-x-1/2 bg-gray-800 px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-fade-in ${
        correct ? "border-green-500" : "border-red-500"
      }`}
      style={{ cursor: "pointer" }}
      onClick={onDismiss}
    >
      {correct ? (
        <>
          <Check className="text-green-400 w-7 h-7" />
          <span className="font-bold text-green-300 text-xl">Correct!</span>
        </>
      ) : (
        <>
          <X className="text-red-400 w-7 h-7" />
          <span className="font-bold text-red-300 text-xl">Wrong, try again</span>
        </>
      )}
      <span className="ml-3 text-gray-400 text-xs">(click to dismiss)</span>
    </div>
  );
};

export default QuizFeedback;
