
import React from 'react';

interface StatusCardProps {
  title: string;
  value: number;
  delay?: number;
}

const StatusCard = ({ title, value, delay = 0 }: StatusCardProps) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:bg-gray-750 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-white text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
};

export default StatusCard;
