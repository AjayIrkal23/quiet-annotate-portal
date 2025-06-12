
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Image, Trophy, ImageIcon } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/annotation', icon: Image, label: 'Annotation' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 w-64 min-h-screen p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-xl">
            AnnotateAI
          </h1>
          <p className="text-gray-400 text-xs">Annotation Studio</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === path
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:scale-105'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-xs text-center">
            Powered by AI
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
