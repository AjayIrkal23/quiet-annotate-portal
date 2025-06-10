import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issueType: string;
}

interface Image {
  id: string;
  src: string;
  name: string;
}

const Annotation = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Sample images
  const images: Image[] = [
    { id: '1', src: '/placeholder.svg', name: 'construction_site_001.jpg' },
    { id: '2', src: '/placeholder.svg', name: 'safety_check_002.jpg' },
    { id: '3', src: '/placeholder.svg', name: 'equipment_003.jpg' },
  ];

  const issueTypes = [
    'No Vest',
    'No Helmet',
    'Unsafe Posture',
    'Missing Equipment',
    'Hazard Zone',
    'Other',
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);

    setCurrentBox({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;

    const newBox: BoundingBox = {
      id: Date.now().toString(),
      x: currentBox.x!,
      y: currentBox.y!,
      width: currentBox.width!,
      height: currentBox.height!,
      issueType: 'No Vest',
    };

    setBoundingBoxes([...boundingBoxes, newBox]);
    setCurrentBox(null);
    setIsDrawing(false);
  };

  const updateIssueType = (boxId: string, issueType: string) => {
    setBoundingBoxes(boxes =>
      boxes.map(box => (box.id === boxId ? { ...box, issueType } : box))
    );
  };

  const deleteBox = (boxId: string) => {
    setBoundingBoxes(boxes => boxes.filter(box => box.id !== boxId));
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    setBoundingBoxes([]);
    setCurrentBox(null);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Image Annotation</h1>
        <p className="text-gray-400">Draw bounding boxes and classify safety issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{currentImage.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateImage('prev')}
                  disabled={currentImageIndex === 0}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <span className="text-gray-300 text-sm">
                  {currentImageIndex + 1} of {images.length}
                </span>
                <button
                  onClick={() => navigateImage('next')}
                  disabled={currentImageIndex === images.length - 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                ref={imageRef}
                src={currentImage.src}
                alt={currentImage.name}
                className="w-full h-96 object-cover rounded cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />

              {/* Existing bounding boxes */}
              {boundingBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute border-2 border-red-500 bg-red-500/20"
                  style={{
                    left: box.x,
                    top: box.y,
                    width: box.width,
                    height: box.height,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    {box.issueType}
                  </div>
                </div>
              ))}

              {/* Current drawing box */}
              {currentBox && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/20"
                  style={{
                    left: currentBox.x,
                    top: currentBox.y,
                    width: currentBox.width,
                    height: currentBox.height,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Annotations</h3>
            <div className="space-y-3">
              {boundingBoxes.map((box) => (
                <div key={box.id} className="bg-gray-700 rounded-lg p-3">
                  <select
                    value={box.issueType}
                    onChange={(e) => updateIssueType(box.id, e.target.value)}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-2"
                  >
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteBox(box.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {boundingBoxes.length === 0 && (
                <p className="text-gray-400 text-sm">No annotations yet. Click and drag on the image to start.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Click and drag to draw bounding boxes</li>
              <li>• Select issue type from dropdown</li>
              <li>• Use navigation arrows to switch images</li>
              <li>• Delete unwanted annotations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotation;
