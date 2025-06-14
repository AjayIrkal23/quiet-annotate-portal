import React from "react";
import { useAnnotationManager, dummyImages } from "@/hooks/useAnnotationManager";
import AnnotationCanvas from "@/components/AnnotationCanvas";
import AnnotationSidebar from "@/components/AnnotationSidebar";
import IssueDialog from "@/components/IssueDialog";

// Keep UI layout and structure, but delegate logic via hook.
const Annotation: React.FC = () => {
  const {
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    currentImageIndex,
    issues,
    currentBox,
    pendingBox,
    issueDialogOpen,
    imageRef,
    canvasRef,
    boundingBoxes,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNextImage,
    handlePreviousImage,
    handleDeleteBoundingBox,
    handleSelectIssue,
    handleAddIssue,
    handleRemoveIssue,
    setIssueDialogOpen,
  } = useAnnotationManager();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      {/* Header (Title + Instructions) */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-lg flex items-center justify-center">
              {/* Image icon */}
              <span className="text-white text-lg font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM6 16.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0-3.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm0-3.25a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div>
              <h1 className="font-bold  text-2xl text-white">
                Image Annotation
              </h1>
              <p className="text-gray-400 text-sm">
                Draw bounding boxes around issues in the image
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar - annotations + issues */}
        <div className="xl:w-80 w-full order-2 xl:order-1 mb-6 xl:mb-0">
          <AnnotationSidebar
            boundingBoxes={boundingBoxes}
            issues={issues}
            onDeleteBoundingBox={handleDeleteBoundingBox}
          />
        </div>

        {/* Main Canvas - image + drawing */}
        <div className="flex-1 order-1 xl:order-2">
          <AnnotationCanvas
            dummyImages={dummyImages}
            currentImageIndex={currentImageIndex}
            IMAGE_WIDTH={IMAGE_WIDTH}
            IMAGE_HEIGHT={IMAGE_HEIGHT}
            imageRef={imageRef}
            canvasRef={canvasRef}
            issues={issues}
            boundingBoxes={boundingBoxes}
            currentBox={currentBox}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onNextImage={handleNextImage}
            onPreviousImage={handlePreviousImage}
          />
        </div>
      </div>

      {/* Issue type selection dialog */}
      <IssueDialog
        open={issueDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIssueDialogOpen(false);
          }
        }}
        onSelectIssue={handleSelectIssue}
        issues={issues}
        onAddIssue={handleAddIssue}
        onRemoveIssue={handleRemoveIssue}
      />
    </div>
  );
};

export default Annotation;
