
import React from 'react';
import { Trophy, Target, CheckCircle } from 'lucide-react';

interface ScoreCardProps {
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ correctAnswers, totalQuestions, accuracy }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3">
      <div className="flex items-center space-x-2 mb-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Score</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
          </div>
          <div className="text-lg font-bold text-green-400">{correctAnswers}</div>
          <div className="text-xs text-gray-400">Correct</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">{totalQuestions}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-lg font-bold text-yellow-400">{accuracy}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
