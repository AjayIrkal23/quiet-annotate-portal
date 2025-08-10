import { Trophy, Medal, Award } from "lucide-react";

export const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="w-6 h-6 text-yellow-400" />;
    case 1:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 2:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {index + 1}
        </span>
      );
  }
};

export const getRankGradient = (index: number) => {
  switch (index) {
    case 0:
      return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    case 1:
      return "from-gray-400/20 to-gray-600/20 border-gray-400/30";
    case 2:
      return "from-amber-600/20 to-amber-800/20 border-amber-600/30";
    default:
      return "from-gray-700/20 to-gray-800/20 border-gray-600/30";
  }
};
