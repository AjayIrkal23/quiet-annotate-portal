import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Send, CheckCircle, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { ImageData, BoundingBox, CurrentBox, ViolationDetail } from "@/types/annotationTypes";
import { BASEURL } from "@/lib/utils";

interface AnnotationCanvasProps {
  currentImageData: ImageData;
  violationDetails: ViolationDetail[];
  onAddViolationClick: () => void;
  currentImageIndex: number;
  totalImages: number;
  IMAGE_WIDTH: number;
  IMAGE_HEIGHT: number;
  imageRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  boundingBoxes: BoundingBox[];
  currentBox: CurrentBox | null;
  allViolationsAnnotated: boolean;
  zoomActive: boolean;
  setZoomActive: (active: boolean) => void;
  lensPos: { x: number; y: number } | null;
  setLensPos: (pos: { x: number; y: number } | null) => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onSubmitAnnotations: () => void;
  getSeverityColor: (severity: string) => string;
  totalAnnotatedImages: number;
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  currentImageData,
  violationDetails,
  onAddViolationClick,
  currentImageIndex,
  totalImages,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  imageRef,
  canvasRef,
  boundingBoxes,
  currentBox,
  allViolationsAnnotated,
  zoomActive,
  setZoomActive,
  lensPos,
  setLensPos,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onNextImage,
  onPreviousImage,
  onSubmitAnnotations,
  getSeverityColor,
  totalAnnotatedImages,
}) => {
  const isLastImage = currentImageIndex === totalImages - 1;

  // Zoom/magnifier constants
  const lensSize = 160;
  const zoomFactor = 2.2;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWrapperMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, IMAGE_WIDTH));
    const y = Math.max(0, Math.min(e.clientY - rect.top, IMAGE_HEIGHT));
    setLensPos({ x, y });
  };
  const handleWrapperMouseLeave = () => {
    if (zoomActive) setLensPos(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (zoomActive) return; // disable drawing when zooming
    onMouseDown(e);
  };
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (zoomActive) return; // disable drawing when zooming
    onMouseMove(e);
  };
  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (zoomActive) return; // disable drawing when zooming
    onMouseUp(e);
  };

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
            disabled={totalAnnotatedImages === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            <Send className="w-4 h-4" />
            <span>Submit All ({totalAnnotatedImages})</span>
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
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium mb-2">{currentImageData.imageName}</h3>
          <div className="flex items-center gap-3 mt-1.5 ">
            <button
              onClick={() => setZoomActive(!zoomActive)}
              className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 ${
                zoomActive ? "ring-2 ring-purple-500" : ""
              }`}
            >
              {zoomActive ? (
                <>
                  <ZoomOut className="w-4 h-4" />
                  <span className="text-sm">Zoom Off</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-4 h-4" />
                  <span className="text-sm">Zoom</span>
                </>
              )}
            </button>
            <button
              onClick={onAddViolationClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700    text-white px-3 py-1.5 rounded-lg transition-all duration-200 "
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Violation</span>
            </button>
            {allViolationsAnnotated && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">All violations annotated</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          {allViolationsAnnotated
            ? "This image has been fully annotated. All violations have bounding boxes."
            : isLastImage
            ? "This is the last image. Click 'Submit All' to send all annotations."
            : "Draw bounding boxes around the violations listed in the sidebar"}
        </p>
      </div>

      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-600"
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          onMouseMove={handleWrapperMouseMove}
          onMouseLeave={handleWrapperMouseLeave}
        >
          <img
            ref={imageRef}
            src={`${BASEURL}/${currentImageData.imagePath}`}
            alt={currentImageData.imageName}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          />

          <canvas
            ref={canvasRef}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className={`absolute inset-0 ${allViolationsAnnotated ? "cursor-not-allowed" : zoomActive ? "cursor-zoom-in" : "cursor-crosshair"}`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          />

          {/* Render bounding boxes */}
          {boundingBoxes.map((box) => {
            const violation = violationDetails.find((v) => v.name === box.violationName);
            const color = violation ? getSeverityColor(violation.severity) : "#ef4444";
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
          {currentBox && currentBox.width !== 0 && currentBox.height !== 0 && (
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

          {/* Zoom lens */}
          {zoomActive && lensPos && (
            <div
              className="absolute rounded-full pointer-events-none shadow-2xl"
              style={{
                width: lensSize,
                height: lensSize,
                left: lensPos.x - lensSize / 2,
                top: lensPos.y - lensSize / 2,
                backgroundImage: `url(${BASEURL}/${currentImageData.imagePath})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${IMAGE_WIDTH * zoomFactor}px ${IMAGE_HEIGHT * zoomFactor}px`,
                backgroundPosition: `-${lensPos.x * zoomFactor - lensSize / 2}px -${lensPos.y * zoomFactor - lensSize / 2}px`,
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            />
          )}

          {/* Overlay when all violations are annotated */}
          {allViolationsAnnotated && (
            <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/50 rounded-xl pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};
export default AnnotationCanvas;
