
import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Save, RotateCcw, Image as ImageIcon, AlertTriangle, FolderOpen, Clock, Grid3X3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface DummyImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  category: string;
}

const issues: Issue[] = [
  { value: 'pothole', label: 'Pothole', color: '#ef4444' },
  { value: 'crack', label: 'Road Crack', color: '#f97316' },
  { value: 'debris', label: 'Debris', color: '#eab308' },
  { value: 'marking', label: 'Missing Marking', color: '#3b82f6' },
  { value: 'sign', label: 'Damaged Sign', color: '#8b5cf6' },
  { value: 'other', label: 'Other Issue', color: '#6b7280' }
];

const dummyImages: DummyImage[] = [
  {
    id: '1',
    name: 'Street View 1',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
    category: 'Urban Roads'
  },
  {
    id: '2',
    name: 'Highway Damage',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
    category: 'Highway'
  },
  {
    id: '3',
    name: 'City Street',
    url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=150&fit=crop',
    category: 'Urban Roads'
  },
  {
    id: '4',
    name: 'Road Construction',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=150&fit=crop',
    category: 'Construction'
  },
  {
    id: '5',
    name: 'Rural Road',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
    category: 'Rural Roads'
  },
  {
    id: '6',
    name: 'Bridge Infrastructure',
    url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=150&fit=crop',
    category: 'Infrastructure'
  }
];

const Annotation = () => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string>('pothole');
  const [customIssues, setCustomIssues] = useState<Issue[]>([]);
  const [selectedImage, setSelectedImage] = useState<DummyImage>(dummyImages[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = ['all', ...Array.from(new Set(dummyImages.map(img => img.category)))];
  const filteredImages = selectedCategory === 'all' 
    ? dummyImages 
    : dummyImages.filter(img => img.category === selectedCategory);

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentBox({
      id: Date.now().toString(),
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      issue: selectedIssue
    });
  }, [getMousePos, selectedIssue]);

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
      setBoundingBoxes(prev => [...prev, currentBox as BoundingBox]);
    }
    setIsDrawing(false);
    setCurrentBox(null);
  }, [currentBox]);

  const deleteBoundingBox = (id: string) => {
    setBoundingBoxes(prev => prev.filter(box => box.id !== id));
  };

  const addCustomIssue = () => {
    const newIssue = prompt('Enter custom issue name:');
    if (newIssue && !allIssues.find(i => i.value === newIssue.toLowerCase())) {
      const customIssue: Issue = {
        value: newIssue.toLowerCase().replace(/\s+/g, '_'),
        label: newIssue,
        color: '#f59e0b'
      };
      setCustomIssues(prev => [...prev, customIssue]);
      setSelectedIssue(customIssue.value);
    }
  };

  const removeCustomIssue = (issueValue: string) => {
    setCustomIssues(prev => prev.filter(issue => issue.value !== issueValue));
    if (selectedIssue === issueValue) {
      setSelectedIssue('pothole');
    }
  };

  const allIssues = [...issues, ...customIssues];
  const selectedIssueData = allIssues.find(i => i.value === selectedIssue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Premium Sidebar */}
      <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Project Images</h1>
              <p className="text-gray-400 text-sm">Select an image to annotate</p>
            </div>
          </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Gallery */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {filteredImages.map(image => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedImage.id === image.id
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                    : 'hover:ring-1 hover:ring-gray-500'
                }`}
              >
                <img
                  src={image.thumbnail}
                  alt={image.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-medium text-sm truncate">{image.name}</h3>
                  <p className="text-gray-300 text-xs">{image.category}</p>
                </div>
                {selectedImage.id === image.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4" />
              <span>Current Session</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Annotations</span>
                <span className="text-white font-medium">{boundingBoxes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issues Found</span>
                <span className="text-white font-medium">{new Set(boundingBoxes.map(b => b.issue)).size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Image</span>
                <span className="text-white font-medium truncate ml-2">{selectedImage.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
                    Annotation Studio
                  </h1>
                  <p className="text-gray-400 text-sm">Click and drag to create annotations • {boundingBoxes.length} total</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setBoundingBoxes([])}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                  <Save className="w-4 h-4" />
                  <span>Save Annotations</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Canvas Area */}
          <div className="flex-1 p-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl h-full">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">{selectedImage.name}</h2>
                  <div className="text-sm text-gray-400">
                    {selectedImage.category} • 800×600px
                  </div>
                </div>
                
                <div ref={containerRef} className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-600">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="absolute inset-0 cursor-crosshair w-full h-full"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  />
                  
                  {/* Render bounding boxes */}
                  {boundingBoxes.map(box => {
                    const issueData = allIssues.find(i => i.value === box.issue);
                    return (
                      <div
                        key={box.id}
                        className="absolute border-2 bg-opacity-10 rounded pointer-events-none"
                        style={{
                          left: Math.min(box.x, box.x + box.width),
                          top: Math.min(box.y, box.y + box.height),
                          width: Math.abs(box.width),
                          height: Math.abs(box.height),
                          borderColor: issueData?.color || '#6b7280',
                          backgroundColor: issueData?.color || '#6b7280'
                        }}
                      >
                        <div
                          className="absolute -top-8 left-0 px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: issueData?.color || '#6b7280' }}
                        >
                          {issueData?.label || 'Unknown'}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Render current drawing box */}
                  {currentBox && currentBox.width !== 0 && currentBox.height !== 0 && (
                    <div
                      className="absolute border-2 border-dashed bg-opacity-20 rounded pointer-events-none"
                      style={{
                        left: Math.min(currentBox.x!, currentBox.x! + currentBox.width!),
                        top: Math.min(currentBox.y!, currentBox.y! + currentBox.height!),
                        width: Math.abs(currentBox.width!),
                        height: Math.abs(currentBox.height!),
                        borderColor: selectedIssueData?.color || '#6b7280',
                        backgroundColor: selectedIssueData?.color || '#6b7280'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6 pl-0">
            <div className="space-y-6">
              {/* Issue Selection */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span>Issue Type</span>
                </h3>
                
                <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {allIssues.map(issue => (
                      <SelectItem key={issue.value} value={issue.value} className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: issue.color }} />
                          <span>{issue.label}</span>
                          {customIssues.find(ci => ci.value === issue.value) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomIssue(issue.value);
                              }}
                              className="ml-auto text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  onClick={addCustomIssue}
                  className="w-full mt-3 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Issue</span>
                </button>
              </div>

              {/* Annotations List */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Annotations ({boundingBoxes.length})</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {boundingBoxes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-sm">No annotations yet</p>
                      <p className="text-gray-500 text-xs">Click and drag to create</p>
                    </div>
                  ) : (
                    boundingBoxes.map((box, index) => {
                      const issueData = allIssues.find(i => i.value === box.issue);
                      return (
                        <div key={box.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: issueData?.color || '#6b7280' }} />
                              <div>
                                <p className="text-white font-medium text-sm">{issueData?.label || 'Unknown'}</p>
                                <p className="text-gray-400 text-xs">
                                  {Math.round(Math.abs(box.width))}×{Math.round(Math.abs(box.height))}px
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotation;
