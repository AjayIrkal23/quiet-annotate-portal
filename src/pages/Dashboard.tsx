
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StatusCard from '../components/StatusCard';

const Dashboard = () => {
  const { totalAccImages, totalImagesOptioned, totalImagesWaiting } = useSelector(
    (state: RootState) => state.dashboard
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your image annotation and verification progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard
          title="Total ACC Images"
          value={totalAccImages}
          delay={0}
        />
        <StatusCard
          title="Total Images Optioned"
          value={totalImagesOptioned}
          delay={100}
        />
        <StatusCard
          title="Images Waiting for Options"
          value={totalImagesWaiting}
          delay={200}
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">New images uploaded</span>
            <span className="text-blue-400 font-medium">+127 today</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Annotations completed</span>
            <span className="text-green-400 font-medium">+89 today</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-300">Quality checks passed</span>
            <span className="text-purple-400 font-medium">95.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
