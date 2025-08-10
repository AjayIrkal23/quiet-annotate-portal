import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

const RewardsList = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in">
    <h3 className="text-lg font-bold text-white mb-4">Rewards</h3>
    {[
      {
        icon: <Trophy className="w-4 h-4 text-yellow-400" />,
        title: "1st Prize",
        desc: "1 month free canteen credit",
        color: "yellow-500",
      },
      {
        icon: <Medal className="w-4 h-4 text-gray-300" />,
        title: "2nd Prize",
        desc: "10 days free canteen credit",
        color: "gray-400",
      },
      {
        icon: <Award className="w-4 h-4 text-amber-600" />,
        title: "3rd Prize",
        desc: "3 days free canteen credit",
        color: "amber-600",
      },
    ].map((reward, i) => (
      <div
        key={i}
        className={`bg-${reward.color}/10 border border-${reward.color}/20 rounded-lg p-3 mb-3`}
      >
        <div className="flex items-center space-x-2">
          {reward.icon}
          <span className={`text-${reward.color} font-medium text-sm`}>
            {reward.title}
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-1">{reward.desc}</p>
      </div>
    ))}
  </div>
);

export default RewardsList;
