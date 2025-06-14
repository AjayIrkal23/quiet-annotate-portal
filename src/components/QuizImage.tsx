
import React from "react";

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

interface QuizImageProps {
  imageUrl: string;
  boundingBoxes: BoundingBox[];
  revealedBoxes: { [id: string]: boolean };
  answeredBoxes: { [id: string]: boolean };
  onBoxReveal: (box: BoundingBox) => void;
  imageDims: { width: number; height: number };
  lockedUI: boolean;
  quizForBox: { box: BoundingBox } | null;
  feedbackVisible: boolean;
}

const QuizImage: React.FC<QuizImageProps> = ({
  imageUrl,
  boundingBoxes,
  revealedBoxes,
  answeredBoxes,
  onBoxReveal,
  imageDims,
  lockedUI,
  quizForBox,
  feedbackVisible,
}) => {
  // Click on image to try and reveal a bounding box
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lockedUI || quizForBox || feedbackVisible) return;

    // Get click coordinates relative to image
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find a non-revealed, non-answered bounding box containing this point
    const hiddenBox = boundingBoxes.find(
      (box) =>
        !answeredBoxes[box.id] &&
        !revealedBoxes[box.id] &&
        pointInBox(clickX, clickY, box)
    );
    if (hiddenBox) {
      onBoxReveal(hiddenBox);
    }
  };

  function pointInBox(x: number, y: number, box: BoundingBox) {
    const left = Math.min(box.x, box.x + box.width);
    const top = Math.min(box.y, box.y + box.height);
    const right = Math.max(box.x, box.x + box.width);
    const bottom = Math.max(box.y, box.y + box.height);
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  return (
    <div
      className="relative"
      style={{
        width: imageDims.width,
        height: imageDims.height,
        boxShadow: "0 2px 32px 0 rgb(0 0 0 / 30%)",
        borderRadius: 18,
      }}
      onClick={handleImageClick}
      tabIndex={0}
    >
      <img
        src={imageUrl}
        alt="Quiz visual"
        draggable={false}
        className="absolute w-full h-full rounded-xl border border-gray-600 object-cover"
        style={{ width: imageDims.width, height: imageDims.height }}
      />

      {/* Only show a revealed/answered bounding box with NO name */}
      {boundingBoxes.map(
        (box) =>
          (revealedBoxes[box.id] || answeredBoxes[box.id]) && (
            <div
              key={box.id}
              className="absolute transition-opacity duration-150"
              style={{
                left: Math.min(box.x, box.x + box.width),
                top: Math.min(box.y, box.y + box.height),
                width: Math.abs(box.width),
                height: Math.abs(box.height),
                border: answeredBoxes[box.id]
                  ? "3px solid #22c55e"
                  : "3px solid #3b82f6",
                borderRadius: 8,
                background: answeredBoxes[box.id]
                  ? "rgba(34,197,94,0.10)"
                  : "rgba(59,130,246,0.09)",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />
          )
      )}

      {/* Block overlay while not finished */}
      {/* No overlay here; handled in parent if needed */}
    </div>
  );
};

export default QuizImage;
