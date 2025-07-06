import React from 'react';
import { useLocation } from 'react-router-dom';
const Navbar = () => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Image Upload';
      case '/annotation':
        return 'Annotation';
      case '/leaderboard':
        return 'Leaderboard';
      default:
        return 'Dashboard';
    }
  };
  return;
};
export default Navbar;