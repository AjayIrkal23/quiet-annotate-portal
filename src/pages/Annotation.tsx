
import React from "react";
import { useAnnotationManager } from "@/hooks/useAnnotationManager";
import AnnotationCanvas from "@/components/AnnotationCanvas";
import AnnotationSidebar from "@/components/AnnotationSidebar";
import ViolationDialog from "@/components/ViolationDialog";

const Annotation: React.FC = () => {
  const {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    currentImageIndex,
    currentImageData,
    currentBox,
    pendingBox,
    violationDialogOpen,
    setViolationDialogOpen,
    imageRef,
    canvasRef,
    boundingBoxes,
    totalImages,
    totalAnnotatedImages,
    allViolationsAnnotated,
    availableViolations,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNextImage,
    handlePreviousImage,
    handleDeleteBoundingBox,
    handleSelectViolation,
    handleSubmitAnnotations,
    getSeverityColor,
  } = useAnnotationManager();

  if (!currentImageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">No Images Available</h1>
          <p className="text-gray-400">Please check back later for images to annotate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">📋</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-white">
                Safety Violation Annotation
              </h1>
              <p className="text-gray-400 text-sm">
                Annotate the safety violations identified in the image ({totalAnnotatedImages} images annotated)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar - violations + annotations */}
        <div className="xl:w-80 w-full order-2 xl:order-1 mb-6 xl:mb-0">
          <AnnotationSidebar
            currentImageData={currentImageData}
            boundingBoxes={boundingBoxes}
            onDeleteBoundingBox={handleDeleteBoundingBox}
            getSeverityColor={getSeverityColor}
          />
        </div>

        {/* Main Canvas - image + drawing */}
        <div className="flex-1 order-1 xl:order-2">
          <AnnotationCanvas
            currentImageData={currentImageData}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
            IMAGE_WIDTH={IMAGE_WIDTH}
            IMAGE_HEIGHT={IMAGE_HEIGHT}
            imageRef={imageRef}
            canvasRef={canvasRef}
            boundingBoxes={boundingBoxes}
            currentBox={currentBox}
            allViolationsAnnotated={allViolationsAnnotated}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onNextImage={handleNextImage}
            onPreviousImage={handlePreviousImage}
            onSubmitAnnotations={handleSubmitAnnotations}
            getSeverityColor={getSeverityColor}
            totalAnnotatedImages={totalAnnotatedImages}
          />
        </div>
      </div>

      {/* Violation selection dialog */}
      <ViolationDialog
        open={violationDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setViolationDialogOpen(false);
          }
        }}
        onSelectViolation={handleSelectViolation}
        violations={availableViolations}
        getSeverityColor={getSeverityColor}
      />
    </div>
  );
};

export default Annotation;
