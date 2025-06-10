
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const { entries } = useSelector((state: RootState) => state.leaderboard);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-gray-400 font-medium">{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">1st</span>;
      case 1:
        return <span className="bg-gray-400 text-black px-2 py-1 rounded text-xs font-bold">2nd</span>;
      case 2:
        return <span className="bg-orange-500 text-black px-2 py-1 rounded text-xs font-bold">3rd</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top performers in image annotation and verification</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Current Rankings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Objects Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Images Verified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-750 transition-colors ${
                    index < 3 ? 'bg-gray-800/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index)}
                      {getRankBadge(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {entry.username.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className={`font-medium ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                        {entry.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-500' :
                      'text-white'
                    }`}>
                      {entry.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {entry.objectsVerified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {entry.imagesVerified}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Top Scorer</h3>
          <p className="text-2xl font-bold text-yellow-500">{entries[0]?.username}</p>
          <p className="text-gray-400">{entries[0]?.score} points</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Most Objects</h3>
          <p className="text-2xl font-bold text-blue-400">{entries[0]?.objectsVerified}</p>
          <p className="text-gray-400">verified by {entries[0]?.username}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Most Images</h3>
          <p className="text-2xl font-bold text-green-400">{entries[0]?.imagesVerified}</p>
          <p className="text-gray-400">verified by {entries[0]?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
