
import React from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { ImageData, BoundingBox, CurrentBox } from "@/types/annotationTypes";

interface AnnotationCanvasProps {
  currentImageData: ImageData;
  currentImageIndex: number;
  totalImages: number;
  IMAGE_WIDTH: number;
  IMAGE_HEIGHT: number;
  imageRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  boundingBoxes: BoundingBox[];
  currentBox: CurrentBox | null;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onSubmitAnnotations: () => void;
  getSeverityColor: (severity: string) => string;
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  currentImageData,
  currentImageIndex,
  totalImages,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  imageRef,
  canvasRef,
  boundingBoxes,
  currentBox,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onNextImage,
  onPreviousImage,
  onSubmitAnnotations,
  getSeverityColor,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-white">Annotation Canvas</h2>
          <div className="text-sm text-gray-400">
            Image {currentImageIndex + 1} of {totalImages}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onPreviousImage}
            disabled={currentImageIndex === 0}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={onSubmitAnnotations}
            disabled={boundingBoxes.length === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </button>
          
          <button
            onClick={onNextImage}
            disabled={currentImageIndex === totalImages - 1}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-white font-medium mb-2">{currentImageData.imageName}</h3>
        <p className="text-gray-400 text-sm">Draw bounding boxes around the violations listed in the sidebar</p>
      </div>

      <div className="flex justify-center">
        <div
          className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-600"
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
        >
          <img
            ref={imageRef}
            src={currentImageData.imagePath}
            alt={currentImageData.imageName}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          />

          <canvas
            ref={canvasRef}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="absolute inset-0 cursor-crosshair"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          />

          {/* Render bounding boxes */}
          {boundingBoxes.map((box) => {
            const violation = currentImageData.violationDetails.find(v => v.name === box.violationName);
            const color = violation ? getSeverityColor(violation.severity) : '#ef4444';
            
            return (
              <div
                key={box.id}
                className="absolute border-2 rounded pointer-events-none"
                style={{
                  left: Math.min(box.x, box.x + box.width),
                  top: Math.min(box.y, box.y + box.height),
                  width: Math.abs(box.width),
                  height: Math.abs(box.height),
                  borderColor: color,
                  backgroundColor: "transparent",
                }}
              >
                <div 
                  className="absolute -top-8 left-0 px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  {box.violationName}
                </div>
              </div>
            );
          })}

          {/* Render current drawing box */}
          {currentBox &&
            currentBox.width !== 0 &&
            currentBox.height !== 0 && (
              <div
                className="absolute border-2 border-dashed border-red-500 rounded pointer-events-none"
                style={{
                  left: Math.min(currentBox.x!, currentBox.x! + currentBox.width!),
                  top: Math.min(currentBox.y!, currentBox.y! + currentBox.height!),
                  width: Math.abs(currentBox.width!),
                  height: Math.abs(currentBox.height!),
                  backgroundColor: "transparent",
                }}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationCanvas;
