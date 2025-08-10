import React from "react";
import { Trophy } from "lucide-react";

const LeaderboardHeader: React.FC = () => {
  return (
    <div className="mb-8 animate-fade-in lg:col-span-4">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
          Leaderboard
        </h1>
      </div>
      <p className="text-gray-400 font-medium text-sm">
        Top performers in annotation accuracy and verification quality
      </p>
    </div>
  );
};

export default LeaderboardHeader;
