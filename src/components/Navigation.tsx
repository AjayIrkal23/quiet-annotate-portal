
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Image, Trophy, BookOpen } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/annotation', icon: Image, label: 'Annotation' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/users', icon: BookOpen, label: 'Users Quiz' }, // Changed to BookOpen (quiz)
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 w-16 min-h-screen p-3 flex-shrink-0">
      {/* Navigation Items */}
      <div className="space-y-3 mt-6">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              location.pathname === path
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
            title={label}
          >
            <Icon size={20} />
            {/* Hover tooltip */}
            <div
              className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[1000] shadow-xl" // <-- z-[1000] (above all), shadow-xl for elevation
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {label}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

