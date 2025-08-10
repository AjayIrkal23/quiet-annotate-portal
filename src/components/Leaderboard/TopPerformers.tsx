import { getRankGradient, getRankIcon } from "./utils";

const TopPerformers = ({ entries }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in">
    <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
    {entries.slice(0, 3).map((entry, index) => (
      <div
        key={entry.employeeId}
        className={`bg-gradient-to-r ${getRankGradient(
          index
        )} rounded-lg p-4 border mb-3`}
      >
        <div className="flex items-center space-x-3">
          {getRankIcon(index)}
          <div>
            <h4 className="text-sm font-bold text-white">{entry.name}</h4>
            <p className="text-gray-400 text-xs">
              Sl no. {index + 1} | Emp ID: {entry.employeeId}
            </p>
            <p className="text-yellow-400 text-sm font-semibold">
              Score: {entry.totalScore}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TopPerformers;
