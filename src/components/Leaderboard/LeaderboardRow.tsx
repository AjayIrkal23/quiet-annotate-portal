import React from "react";
import { getRankIcon, getRankGradient } from "./utils";

interface Props {
  entry: any;
  index: number;
}

const LeaderboardRow: React.FC<Props> = ({ entry, index }) => {
  return (
    <div
      className={`bg-gradient-to-r ${getRankGradient(
        index
      )} rounded-xl p-6 border transition-all duration-200 hover:scale-105 animate-fade-in`}
      style={{ animationDelay: `${200 + index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getRankIcon(index)}
          <div>
            <h3 className="text-lg font-bold text-white">{entry.name}</h3>
            <p className="text-gray-400 text-sm">
              Sl no. {index + 1} | Emp ID: {entry.employeeId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <Stat
            label="Score"
            value={entry.totalScore}
            color="white"
            size="2xl"
          />
          <Stat
            label="Valid Violations"
            value={entry.totalValidatedViolations}
            color="blue-400"
          />
          <Stat label="Images" value={entry.totalImages} color="green-400" />
          <Stat
            label="Invalid Violations"
            value={entry.totalInvalidViolations}
            color="red-400"
          />
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, color, size = "lg" }) => (
  <div className="text-center">
    <p className={`text-${size} font-semibold text-${color}`}>{value}</p>
    <p className="text-gray-400 text-xs">{label}</p>
  </div>
);

export default LeaderboardRow;
