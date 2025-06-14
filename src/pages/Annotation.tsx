import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Trash2, Save, RotateCcw, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import IssueDialog from '../components/IssueDialog';
import { useDispatch, useSelector } from "react-redux";
import { saveAnnotationForImage, clearAnnotationsForImage } from "../store/annotationSlice";
import { RootState } from "../store/store";
import { useToast } from "@/hooks/use-toast";

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  issue: string;
}

interface Issue {
  value: string;
  label: string;
  color: string;
}

const defaultIssues: Issue[] = [
  { value: 'pothole', label: 'Pothole', color: '#ef4444' },
  { value: 'crack', label: 'Road Crack', color: '#f97316' },
  { value: 'debris', label: 'Debris', color: '#eab308' },
  { value: 'marking', label: 'Missing Marking', color: '#3b82f6' },
  { value: 'sign', label: 'Damaged Sign', color: '#8b5cf6' },
  { value: 'other', label: 'Other Issue', color: '#6b7280' }
];

// Dummy images for annotation
const dummyImages = [
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop'
];

const Annotation = () => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  const [issues, setIssues] = useState<Issue[]>(defaultIssues);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [pendingBox, setPendingBox] = useState<Partial<BoundingBox> | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Responsive dimensions - larger for bigger screens
  const getImageDimensions = () => {
    if (window.innerWidth >= 1536) { // 2xl screens
      return { width: 1000, height: 700 };
    } else if (window.innerWidth >= 1280) { // xl screens
      return { width: 900, height: 650 };
    } else if (window.innerWidth >= 1024) { // lg screens
      return { width: 800, height: 600 };
    } else {
      return { width: 700, height: 500 }; // default
    }
  };

  const { width: IMAGE_WIDTH, height: IMAGE_HEIGHT } = getImageDimensions();

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = IMAGE_WIDTH / rect.width;
    const scaleY = IMAGE_HEIGHT / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, [IMAGE_WIDTH, IMAGE_HEIGHT]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentBox({
      id: Date.now().toString(),
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });
  }, [getMousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentBox) return;
    
    const pos = getMousePos(e);
    setCurrentBox(prev => prev ? {
      ...prev,
      width: pos.x - prev.x!,
      height: pos.y - prev.y!
    } : null);
  }, [isDrawing, currentBox, getMousePos]);

  const handleMouseUp = useCallback(() => {
    if (currentBox && Math.abs(currentBox.width!) > 10 && Math.abs(currentBox.height!) > 10) {
      setPendingBox(currentBox);
      setShowIssueDialog(true);
    }
    setIsDrawing(false);
    setCurrentBox(null);
  }, [currentBox]);

  const handleSelectIssue = (issueValue: string) => {
    if (pendingBox) {
      const finalBox: BoundingBox = {
        ...pendingBox,
        issue: issueValue
      } as BoundingBox;
      setBoundingBoxes(prev => [...prev, finalBox]);
      setPendingBox(null);
    }
  };

  const handleAddIssue = (newIssue: Issue) => {
    setIssues(prev => [...prev, newIssue]);
  };

  const handleRemoveIssue = (issueValue: string) => {
    setIssues(prev => prev.filter(issue => issue.value !== issueValue));
    setBoundingBoxes(prev => prev.filter(box => box.issue !== issueValue));
  };

  const deleteBoundingBox = (id: string) => {
    setBoundingBoxes(prev => prev.filter(box => box.id !== id));
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % dummyImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + dummyImages.length) % dummyImages.length);
  };

  const dispatch = useDispatch();
  const { toast } = useToast();

  // Use currentImageIndex as imageId, or you can use dummyImages[currentImageIndex] for more robustness.
  const currentImageId = dummyImages[currentImageIndex];

  // Fetch saved annotations from redux:
  const savedBoxes = useSelector(
    (state: RootState) => state.annotation.annotations[currentImageId] || []
  );

  // FIX: Only reload boxes when currentImageId changes,
  // and ONLY if savedBoxes is different from boundingBoxes
  useEffect(() => {
    setBoundingBoxes(savedBoxes);
  }, [currentImageId, savedBoxes]);

  // Save Handler
  const handleSave = () => {
    dispatch(saveAnnotationForImage({ imageId: currentImageId, boxes: boundingBoxes }));
    toast({
      title: "Annotations Saved",
      description: `Bounding boxes saved for image ${currentImageIndex + 1}`,
    });
  };

  // Clear all annotations for all images
  const handleClearAll = () => {
    setBoundingBoxes([]);
    dispatch(saveAnnotationForImage({ imageId: currentImageId, boxes: [] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Remove AnnotateAI icon/name if still left, just the icon if wanted */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
                Annotation Studio
              </h1>
              <p className="text-gray-400 text-sm">Click and drag to create bounding boxes</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleClearAll} 
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Save className="w-4 h-4" />
              <span>Save Annotations</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Annotations List Sidebar */}
        <div className="xl:w-80 w-full order-2 xl:order-1">
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
                  const issueData = issues.find(i => i.value === box.issue);
                  return (
                    <div key={box.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full border-2"
                            style={{ borderColor: issueData?.color || '#ef4444' }}
                          />
                          <div>
                            <p className="text-white font-medium text-sm">{issueData?.label || 'Unknown'}</p>
                            <p className="text-gray-400 text-xs">
                              {Math.round(box.width)}×{Math.round(box.height)}px
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteBoundingBox(box.id)} 
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

        {/* Main Canvas Area */}
        <div className="flex-1 order-1 xl:order-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-bold text-white">Image Canvas</h2>
                <div className="text-sm text-gray-400">
                  Image {currentImageIndex + 1} of {dummyImages.length}
                </div>
              </div>
              
              {/* Image Navigation */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={previousImage}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button 
                  onClick={nextImage}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-600" style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}>
                <img
                  ref={imageRef}
                  src={dummyImages[currentImageIndex]}
                  alt="Annotation target"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                />
                
                <canvas
                  ref={canvasRef}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  className="absolute inset-0 cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                />
                
                {/* Render bounding boxes */}
                {boundingBoxes.map(box => (
                  <div
                    key={box.id}
                    className="absolute border-2 border-red-500 rounded pointer-events-none"
                    style={{
                      left: Math.min(box.x, box.x + box.width),
                      top: Math.min(box.y, box.y + box.height),
                      width: Math.abs(box.width),
                      height: Math.abs(box.height),
                      backgroundColor: 'transparent'
                    }}
                  >
                    <div 
                      className="absolute -top-8 left-0 bg-red-500 px-2 py-1 rounded text-xs font-medium text-white"
                    >
                      {issues.find(i => i.value === box.issue)?.label || 'Unknown'}
                    </div>
                  </div>
                ))}
                
                {/* Render current drawing box */}
                {currentBox && currentBox.width !== 0 && currentBox.height !== 0 && (
                  <div
                    className="absolute border-2 border-dashed border-red-500 rounded pointer-events-none"
                    style={{
                      left: Math.min(currentBox.x!, currentBox.x! + currentBox.width!),
                      top: Math.min(currentBox.y!, currentBox.y! + currentBox.height!),
                      width: Math.abs(currentBox.width!),
                      height: Math.abs(currentBox.height!),
                      backgroundColor: 'transparent'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Selection Dialog */}
      <IssueDialog
        open={showIssueDialog}
        onOpenChange={setShowIssueDialog}
        onSelectIssue={handleSelectIssue}
        issues={issues}
        onAddIssue={handleAddIssue}
        onRemoveIssue={handleRemoveIssue}
      />
    </div>
  );
};

export default Annotation;
