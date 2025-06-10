
import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/upload': return 'Image Upload';
      case '/annotation': return 'Annotation';
      case '/leaderboard': return 'Leaderboard';
      default: return 'Dashboard';
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-semibold text-lg">Vision Portal</span>
          </div>
          <span className="text-gray-400 text-sm">|</span>
          <span className="text-gray-300 font-medium">{getPageTitle()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-300 text-sm font-medium">AJ</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
