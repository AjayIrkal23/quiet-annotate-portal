
import React from 'react';
import { CheckCircle, Upload, AlertTriangle, Users } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'verification',
    message: 'Quality check completed',
    detail: '127 images verified',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    id: 2,
    type: 'upload',
    message: 'New batch uploaded',
    detail: '89 images added to queue',
    time: '15 minutes ago',
    icon: Upload,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    id: 3,
    type: 'alert',
    message: 'Low accuracy detected',
    detail: 'Review batch #1247',
    time: '1 hour ago',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  {
    id: 4,
    type: 'team',
    message: 'Team milestone reached',
    detail: '10,000 annotations completed',
    time: '3 hours ago',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  }
];

const ActivityFeed = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md"></div>
        <span>Recent Activity</span>
      </h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-700/30 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${500 + index * 100}ms` }}
          >
            <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{activity.message}</p>
              <p className="text-gray-400 text-sm">{activity.detail}</p>
              <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
