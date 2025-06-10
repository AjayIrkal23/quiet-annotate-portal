
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
  trend?: string;
  trendUp?: boolean;
}

const StatusCard = ({ title, value, icon: Icon, delay = 0, trend, trendUp }: StatusCardProps) => {
  return (
    <div 
      className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:bg-gray-700/50 hover:border-blue-500/30 animate-fade-in hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
            <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold ${
            trendUp 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {trendUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</h3>
      <p className="text-white text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {value.toLocaleString()}
      </p>
      
      <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: '0%',
            animation: `expandWidth 1.5s ease-out ${delay + 500}ms forwards`
          }}
        ></div>
      </div>
    </div>
  );
};

export default StatusCard;
