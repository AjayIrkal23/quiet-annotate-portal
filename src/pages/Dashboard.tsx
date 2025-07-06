
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StatusCard from '../components/general/StatusCard';
import AnalyticsChart from '../components/general/AnalyticsChart';
import ActivityFeed from '../components/general/ActivityFeed';
import { Upload, Image, Trophy, Users } from 'lucide-react';

const Dashboard = () => {
  const { stats } = useSelector((state: RootState) => state.dashboard);
  const { uploadedImages } = useSelector((state: RootState) => state.upload);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">📊</span>
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            Safety Annotation Dashboard
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Monitor annotation progress and system performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <StatusCard
          title="Total Images"
          value={uploadedImages.length}
          icon={<Image className="w-6 h-6" />}
        />
        <StatusCard
          title="Annotated"
          value={stats.annotatedImages}
          icon={<Trophy className="w-6 h-6" />}
        />
        <StatusCard
          title="Pending"
          value={uploadedImages.length - stats.annotatedImages}
          icon={<Upload className="w-6 h-6" />}
        />
        <StatusCard
          title="Users"
          value={stats.activeUsers}
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <AnalyticsChart />
        <ActivityFeed />
      </div>
    </div>
  );
};

export default Dashboard;
