
import React from "react";
import { Trash2, AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { ImageData, ViolationDetail, BoundingBox } from "@/types/annotationTypes";

interface AnnotationSidebarProps {
  currentImageData: ImageData;
  boundingBoxes: BoundingBox[];
  onDeleteBoundingBox: (id: string) => void;
  getSeverityColor: (severity: string) => string;
}

const AnnotationSidebar: React.FC<AnnotationSidebarProps> = ({
  currentImageData,
  boundingBoxes,
  onDeleteBoundingBox,
  getSeverityColor,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'low':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Check if a violation has been annotated
  const isViolationAnnotated = (violationName: string) => {
    return boundingBoxes.some(box => box.violationName === violationName);
  };

  return (
    <div className="space-y-4">
      {/* Violation Details Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-lg font-bold text-white mb-4">
          Violations to Annotate ({currentImageData.violationDetails.length})
        </h3>
        <div className="space-y-3">
          {currentImageData.violationDetails.map((violation, index) => {
            const isAnnotated = isViolationAnnotated(violation.name);
            
            return (
              <div 
                key={index} 
                className={`rounded-lg p-3 border transition-all duration-300 ${
                  isAnnotated 
                    ? 'bg-green-500/20 border-green-400/50' 
                    : 'bg-gray-700/50 border-gray-600/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex items-center space-x-2">
                    <div 
                      className=""
                      style={{ color: getSeverityColor(violation.severity) }}
                    >
                      {getSeverityIcon(violation.severity)}
                    </div>
                    {isAnnotated && (
                      <div className="text-green-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium text-sm">{violation.name}</h4>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getSeverityColor(violation.severity) }}
                      >
                        {violation.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{violation.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Annotations Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-lg font-bold text-white mb-4">
          Current Annotations ({boundingBoxes.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {boundingBoxes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">No annotations yet</p>
              <p className="text-gray-500 text-xs">Click and drag to create</p>
            </div>
          ) : (
            boundingBoxes.map((box) => {
              const violation = currentImageData.violationDetails.find(v => v.name === box.violationName);
              const color = violation ? getSeverityColor(violation.severity) : '#ef4444';
              
              return (
                <div key={box.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: color }}
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{box.violationName}</p>
                        <p className="text-gray-400 text-xs">
                          {Math.round(Math.abs(box.width))}×{Math.round(Math.abs(box.height))}px
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteBoundingBox(box.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationSidebar;
