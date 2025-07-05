
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Users: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">👤</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-white">
                User Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome to the annotation system
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">
            Start Annotating
          </h2>
          <p className="text-gray-400 mb-6">
            Begin annotating safety violations in images to contribute to the safety assessment system.
          </p>
          <Button 
            onClick={() => navigate('/annotation')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg"
          >
            Go to Annotation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
