import React from "react";
import LeaderboardRow from "./LeaderboardRow";

interface Props {
  entries: any[];
}

const LeaderboardList: React.FC<Props> = ({ entries }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md"></div>
      <h2 className="text-xl font-bold text-white">Rankings</h2>
    </div>
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <LeaderboardRow key={entry.employeeId} entry={entry} index={index} />
      ))}
    </div>
  </div>
);

export default LeaderboardList;
