import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchLeaderboard } from "../store/leaderboardSlice";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const Leaderboard: React.FC = () => {
  const dispatch = useDispatch();
  const { entries, loading, error } = useSelector(
    (state: RootState) => state.leaderboard
  );

  // Fetch leaderboard data on component mount
  React.useEffect(() => {
    dispatch(fetchLeaderboard() as any);
  }, [dispatch]);

  const getRankIcon = (index: number) => {
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

  const getRankGradient = (index: number) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <p className="text-white text-lg">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-3">
          <div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md"></div>
              <h2 className="text-xl font-bold text-white">Rankings</h2>
            </div>
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={entry.employeeId}
                  className={`bg-gradient-to-r ${getRankGradient(
                    index
                  )} rounded-xl p-6 border transition-all duration-200 hover:scale-105 animate-fade-in`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getRankIcon(index)}
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {entry.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Sl no. {index + 1} | Emp ID: {entry.employeeId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {entry.totalScore}
                        </p>
                        <p className="text-gray-400 text-xs">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-400">
                          {entry.totalValidatedViolations}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Valid Violations
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-400">
                          {entry.totalImages}
                        </p>
                        <p className="text-gray-400 text-xs">Images</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-red-400">
                          {entry.totalInvalidViolations}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Invalid Violations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Top Performers</h3>
            </div>
            <div className="space-y-4">
              {entries.slice(0, 3).map((entry, index) => (
                <div
                  key={entry.employeeId}
                  className={`bg-gradient-to-r ${getRankGradient(
                    index
                  )} rounded-lg p-4 border`}
                >
                  <div className="flex items-center space-x-3">
                    {getRankIcon(index)}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {entry.name}
                      </h4>
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
          </div>
          <div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Rewards</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium text-sm">
                    1st Prize
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  1 month free canteen credit
                </p>
              </div>
              <div className="bg-gray-400/10 border border-gray-400/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Medal className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-300 font-medium text-sm">
                    2nd Prize
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  10 days free canteen credit
                </p>
              </div>
              <div className="bg-amber-600/10 border border-amber-600/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-600 font-medium text-sm">
                    3rd Prize
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  3 days free canteen credit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
