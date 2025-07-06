
import React from "react";
import { Button } from "@/components/ui/button";

interface Issue {
  value: string;
  label: string;
  color: string;
}

interface QuizOptionsProps {
  quizForBox: {
    box: any;
    options: Issue[];
    correct: Issue;
  } | null;
  onAnswer: (opt: Issue) => void;
  lockedUI: boolean;
}

const QuizOptions: React.FC<QuizOptionsProps> = ({
  quizForBox,
  onAnswer,
  lockedUI,
}) => {
  if (!quizForBox) return null;
  return (
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
            onClick={() => onAnswer(opt)}
            disabled={lockedUI}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizOptions;
