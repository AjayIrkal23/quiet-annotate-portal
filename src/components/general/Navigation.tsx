import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Upload, Image, Trophy, User, LogOut } from 'lucide-react';
import { createPortal } from 'react-dom';

// Floating sidebar tooltip as a portal to <body>
const SidebarTooltip: React.FC<{
  targetRect: DOMRect | null;
  children: React.ReactNode;
  show: boolean;
}> = ({ targetRect, children, show }) => {
  if (!show || !targetRect) return null;

  // Tooltip appears right beside the sidebar icon (to the right, vertically centered)
  const style: React.CSSProperties = {
    position: 'fixed',
    top: targetRect.top + targetRect.height / 2,
    left: targetRect.right + 10,
    transform: 'translateY(-50%)',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  return createPortal(
    <div
      className="px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-xl min-w-max opacity-100 animate-fade-in"
      style={style}
    >
      {children}
    </div>,
    document.body
  );
};

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/upload', icon: Upload, label: 'Upload' },
  { path: '/annotation', icon: Image, label: 'Annotation' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    rect: DOMRect | null;
    label: string | null;
  }>({ rect: null, label: null });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 w-16 min-h-screen p-3 flex-shrink-0 z-[51] flex flex-col justify-between">
      {/* Navigation Items */}
      <div className="space-y-3 mt-6">
        {navItems.map(({ path, icon: Icon, label }) => {
          const ref = useRef<HTMLAnchorElement>(null);
          const isActive = location.pathname === path;
          
          return (
            <div
              key={path}
              onMouseEnter={() => {
                if (ref.current) {
                  setTooltip({ rect: ref.current.getBoundingClientRect(), label });
                }
              }}
              onMouseLeave={() => setTooltip({ rect: null, label: null })}
              className="relative"
            >
              <Link
                ref={ref}
                to={path}
                className={`group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
                title={label}
                tabIndex={0}
              >
                <Icon size={20} />
              </Link>
              {/* Tooltip is now Portaled */}
              {tooltip.label === label && tooltip.rect && (
                <SidebarTooltip
                  targetRect={tooltip.rect}
                  show={!!tooltip.rect}
                >
                  {label}
                </SidebarTooltip>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mb-6">
        <div
          onMouseEnter={(e) => setTooltip({ rect: e.currentTarget.getBoundingClientRect(), label: 'Logout' })}
          onMouseLeave={() => setTooltip({ rect: null, label: null })}
          className="relative"
        >
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
          {tooltip.label === 'Logout' && tooltip.rect && (
            <SidebarTooltip
              targetRect={tooltip.rect}
              show={!!tooltip.rect}
            >
              Logout
            </SidebarTooltip>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
