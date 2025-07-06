import React from "react";
import { Monitor } from "lucide-react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (screenWidth < 700) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            UI Not Supported
          </h2>
          <p className="text-gray-400 mb-4">
            This application requires a minimum screen width of 700px for the
            best experience.
          </p>
          <p className="text-gray-500 text-sm">
            Please use a laptop or desktop computer to access this application.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ResponsiveLayout;
