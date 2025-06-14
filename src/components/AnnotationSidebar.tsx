
import React from "react";
import { Trash2 } from "lucide-react";

interface Issue {
  value: string;
  label: string;
  color: string;
}

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

interface AnnotationSidebarProps {
  boundingBoxes: BoundingBox[];
  issues: Issue[];
  onDeleteBoundingBox: (id: string) => void;
}

const AnnotationSidebar: React.FC<AnnotationSidebarProps> = ({
  boundingBoxes,
  issues,
  onDeleteBoundingBox,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
      <h3 className="text-lg font-bold text-white mb-4">Annotations ({boundingBoxes.length})</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {boundingBoxes.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No annotations yet</p>
            <p className="text-gray-500 text-xs">Click and drag to create</p>
          </div>
        ) : (
          boundingBoxes.map((box) => {
            const issueData = issues.find((i) => i.value === box.issue);
            return (
              <div key={box.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{ borderColor: issueData?.color || "#ef4444" }}
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{issueData?.label || "Unknown"}</p>
                      <p className="text-gray-400 text-xs">
                        {Math.round(box.width)}×{Math.round(box.height)}px
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
  );
};

export default AnnotationSidebar;

