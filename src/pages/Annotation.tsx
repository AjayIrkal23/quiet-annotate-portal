import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, RotateCcw, ZoomIn, ZoomOut, Eye, Settings } from 'lucide-react';

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
  const [zoom, setZoom] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // Sample images
  const images: Image[] = [
    { id: '1', src: '/placeholder.svg', name: 'construction_site_001.jpg' },
    { id: '2', src: '/placeholder.svg', name: 'safety_check_002.jpg' },
    { id: '3', src: '/placeholder.svg', name: 'equipment_003.jpg' },
  ];

  const issueTypes = [
    { value: 'No Vest', color: 'border-red-500 bg-red-500/20', label: 'No Safety Vest' },
    { value: 'No Helmet', color: 'border-orange-500 bg-orange-500/20', label: 'No Helmet' },
    { value: 'Unsafe Posture', color: 'border-yellow-500 bg-yellow-500/20', label: 'Unsafe Posture' },
    { value: 'Missing Equipment', color: 'border-blue-500 bg-blue-500/20', label: 'Missing Equipment' },
    { value: 'Hazard Zone', color: 'border-purple-500 bg-purple-500/20', label: 'Hazard Zone' },
    { value: 'Other', color: 'border-gray-500 bg-gray-500/20', label: 'Other Issue' },
  ];

  const getIssueTypeColor = (issueType: string) => {
    const type = issueTypes.find(t => t.value === issueType);
    return type ? type.color : 'border-gray-500 bg-gray-500/20';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / zoom;
    const currentY = (e.clientY - rect.top) / zoom;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">AI Vision Annotation</h1>
              <p className="text-gray-400 text-lg">Intelligent safety detection and classification</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-gray-300 text-sm">Progress:</span>
                <span className="text-blue-400 font-semibold ml-2">{currentImageIndex + 1}/{images.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Image Panel */}
          <div className="col-span-9">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              {/* Image Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold text-white">{currentImage.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Ready for annotation</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Zoom Controls */}
                  <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="p-2 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      <ZoomOut className="h-4 w-4 text-gray-300" />
                    </button>
                    <span className="px-3 text-gray-300 text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="p-2 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      <ZoomIn className="h-4 w-4 text-gray-300" />
                    </button>
                  </div>

                  {/* View Toggle */}
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`p-2 rounded-lg transition-colors ${
                      showAnnotations ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Navigation */}
                  <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                    <button
                      onClick={() => navigateImage('prev')}
                      disabled={currentImageIndex === 0}
                      className="p-2 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-300" />
                    </button>
                    <button
                      onClick={() => navigateImage('next')}
                      disabled={currentImageIndex === images.length - 1}
                      className="p-2 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Container */}
              <div className="relative bg-gray-900/50 rounded-xl p-4 overflow-hidden">
                <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                  <img
                    ref={imageRef}
                    src={currentImage.src}
                    alt={currentImage.name}
                    className="w-full h-[600px] object-cover rounded-lg cursor-crosshair shadow-lg"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  />

                  {/* Existing bounding boxes */}
                  {showAnnotations && boundingBoxes.map((box) => (
                    <div
                      key={box.id}
                      className={`absolute border-2 ${getIssueTypeColor(box.issueType)} backdrop-blur-sm`}
                      style={{
                        left: box.x * zoom,
                        top: box.y * zoom,
                        width: box.width * zoom,
                        height: box.height * zoom,
                      }}
                    >
                      <div className="absolute -top-8 left-0 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-md border border-gray-600">
                        {box.issueType}
                      </div>
                    </div>
                  ))}

                  {/* Current drawing box */}
                  {currentBox && (
                    <div
                      className="absolute border-2 border-blue-400 bg-blue-400/10 backdrop-blur-sm"
                      style={{
                        left: currentBox.x! * zoom,
                        top: currentBox.y! * zoom,
                        width: currentBox.width! * zoom,
                        height: currentBox.height! * zoom,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3 space-y-6">
            {/* Annotations Panel */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Annotations</h3>
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {boundingBoxes.length} detected
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {boundingBoxes.map((box, index) => (
                  <div key={box.id} className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">Issue #{index + 1}</span>
                      <button
                        onClick={() => deleteBox(box.id)}
                        className="text-red-400 hover:text-red-300 text-xs bg-red-500/20 px-2 py-1 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <select
                      value={box.issueType}
                      onChange={(e) => updateIssueType(box.id, e.target.value)}
                      className="w-full bg-gray-600/50 text-white rounded-lg px-3 py-2 text-sm border border-gray-500/50 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      {issueTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {boundingBoxes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Settings className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No annotations yet</p>
                    <p className="text-gray-500 text-xs mt-1">Click and drag on the image to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Progress</span>
                </button>
                <button 
                  onClick={() => setBoundingBoxes([])}
                  className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Issue Types Legend */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Issue Types</h3>
              <div className="space-y-2">
                {issueTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${type.color}`}></div>
                    <span className="text-gray-300 text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotation;
