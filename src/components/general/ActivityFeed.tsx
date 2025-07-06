
import React from 'react';

const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="text-sm text-gray-400">No recent activity</div>
      </div>
    </div>
  );
};

export default ActivityFeed;
