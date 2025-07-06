
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const data = [
  { name: 'Mon', annotated: 120, valid: 98, wrong: 22 },
  { name: 'Tue', annotated: 150, valid: 125, wrong: 25 },
  { name: 'Wed', annotated: 180, valid: 155, wrong: 25 },
  { name: 'Thu', annotated: 220, valid: 190, wrong: 30 },
  { name: 'Fri', annotated: 280, valid: 245, wrong: 35 },
  { name: 'Sat', annotated: 190, valid: 165, wrong: 25 },
  { name: 'Sun', annotated: 160, valid: 140, wrong: 20 },
];

const AnalyticsChart = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Analytics</h2>
          <p className="text-gray-400 text-sm">Annotation performance trends</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="annotated" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Annotated Images"
            />
            <Line 
              type="monotone" 
              dataKey="valid" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Valid Count"
            />
            <Line 
              type="monotone" 
              dataKey="wrong" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Wrong Count"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
