import React from "react";
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
interface QuizSidebarProps {
  boundingBoxes: BoundingBox[];
  feedbackBoxes: {
    [id: string]: "green" | "red" | undefined;
  };
}
const QuizSidebar: React.FC<QuizSidebarProps> = ({
  boundingBoxes,
  feedbackBoxes
}) => {
  return <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 min-w-[260px] w-full  m-4">
      <h3 className="text-lg font-bold text-white mb-4">
        Bounding Boxes ({boundingBoxes.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {boundingBoxes.length === 0 ? <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No bounding boxes</p>
          </div> : boundingBoxes.map(box => {
        let bg;
        if (feedbackBoxes[box.id] === "green") {
          bg = "bg-green-500/20 border-green-400";
        } else if (feedbackBoxes[box.id] === "red") {
          bg = "bg-red-500/20 border-red-400";
        } else {
          bg = "bg-gray-700/50 border-gray-600/50";
        }
        return <div key={box.id} className={`rounded-lg p-3 border ${bg} transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Colored dot (no issue name shown) */}
                    <div className="w-4 h-4 rounded-full border-2" style={{
                borderColor: "#888"
              }} />
                    <div>
                      <p className="text-white font-medium text-sm">
                        Bounding Box
                      </p>
                      <p className="text-gray-400 text-xs">
                        {Math.round(box.width)}×{Math.round(box.height)}px
                      </p>
                    </div>
                  </div>
                  {/* No delete/trash or issue label */}
                </div>
              </div>;
      })}
      </div>
    </div>;
};
export default QuizSidebar;