
import React from 'react';
import { Trophy, Target, CheckCircle } from 'lucide-react';

interface ScoreCardProps {
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ correctAnswers, totalQuestions, accuracy }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Score</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">{correctAnswers}</div>
          <div className="text-xs text-gray-400">Correct</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400">{totalQuestions}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-yellow-400">{accuracy}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
