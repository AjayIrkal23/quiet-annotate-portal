
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', annotated: 850, valid: 720, wrong: 130 },
  { month: 'Feb', annotated: 920, valid: 780, wrong: 140 },
  { month: 'Mar', annotated: 1100, valid: 950, wrong: 150 },
  { month: 'Apr', annotated: 980, valid: 830, wrong: 150 },
  { month: 'May', annotated: 1250, valid: 1080, wrong: 170 },
  { month: 'Jun', annotated: 1180, valid: 1020, wrong: 160 },
  { month: 'Jul', annotated: 1350, valid: 1150, wrong: 200 },
  { month: 'Aug', annotated: 1420, valid: 1220, wrong: 200 },
  { month: 'Sep', annotated: 1300, valid: 1120, wrong: 180 },
  { month: 'Oct', annotated: 1480, valid: 1280, wrong: 200 },
  { month: 'Nov', annotated: 1380, valid: 1180, wrong: 200 },
  { month: 'Dec', annotated: 1520, valid: 1320, wrong: 200 },
];

const MonthlyAnalytics = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Monthly Analysis</h2>
          <p className="text-gray-400 text-sm">Year overview of annotation performance</p>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
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
            <Bar dataKey="annotated" stackId="a" fill="#3B82F6" name="Annotated Images" />
            <Bar dataKey="valid" stackId="a" fill="#10B981" name="Valid Count" />
            <Bar dataKey="wrong" stackId="a" fill="#EF4444" name="Wrong Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
