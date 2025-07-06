
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StatusCard from '../components/StatusCard';
import AnalyticsChart from '../components/AnalyticsChart';
import MonthlyAnalytics from '../components/MonthlyAnalytics';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const {
    totalAccImages,
    totalImagesOptioned,
    totalImagesWaiting
  } = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Real-time insights and performance metrics for your annotation workflow
        </p>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard title="Total ACC Images" value={totalAccImages} icon={CheckCircle} delay={0} trend="+12%" trendUp={true} />
        <StatusCard title="Images Optioned" value={totalImagesOptioned} icon={Users} delay={100} trend="+8%" trendUp={true} />
        <StatusCard title="Pending Images" value={totalImagesWaiting} icon={Clock} delay={200} trend="-5%" trendUp={false} />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart />
        <MonthlyAnalytics />
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{
        animationDelay: '600ms'
      }}>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-md"></div>
          <span>Performance Overview</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">98.5%</div>
            <div className="text-gray-400 font-medium">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">2.3s</div>
            <div className="text-gray-400 font-medium">Avg Process Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
            <div className="text-gray-400 font-medium">Daily Throughput</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
