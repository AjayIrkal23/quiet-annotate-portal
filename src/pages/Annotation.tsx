
import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Save, RotateCcw, Image as ImageIcon, AlertTriangle } from 'lucide-react';
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

const issues: Issue[] = [
  { value: 'pothole', label: 'Pothole', color: '#ef4444' },
  { value: 'crack', label: 'Road Crack', color: '#f97316' },
  { value: 'debris', label: 'Debris', color: '#eab308' },
  { value: 'marking', label: 'Missing Marking', color: '#3b82f6' },
  { value: 'sign', label: 'Damaged Sign', color: '#8b5cf6' },
  { value: 'other', label: 'Other Issue', color: '#6b7280' },
];

const Annotation = () => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string>('pothole');
  const [customIssues, setCustomIssues] = useState<Issue[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (newIssue && !issues.find(i => i.value === newIssue.toLowerCase())) {
      const customIssue: Issue = {
        value: newIssue.toLowerCase().replace(/\s+/g, '_'),
        label: newIssue,
        color: '#f59e0b'
      };
      setCustomIssues(prev => [...prev, customIssue]);
      setSelectedIssue(customIssue.value);
    }
  };

  const allIssues = [...issues, ...customIssues];
  const selectedIssueData = allIssues.find(i => i.value === selectedIssue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
                <p className="text-gray-400 text-sm">Draw bounding boxes to annotate road issues</p>
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

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Image Canvas</h2>
                <div className="text-sm text-gray-400">
                  Click and drag to draw • {boundingBoxes.length} annotations
                </div>
              </div>
              
              <div ref={containerRef} className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-600">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="absolute inset-0 cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse"%3e%3cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="%23374151" stroke-width="0.5"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100" height="100" fill="url(%23smallGrid)" /%3e%3c/svg%3e")',
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Render bounding boxes */}
                {boundingBoxes.map((box) => {
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
                  {allIssues.map((issue) => (
                    <SelectItem key={issue.value} value={issue.value} className="text-white hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: issue.color }}
                        />
                        <span>{issue.label}</span>
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
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: issueData?.color || '#6b7280' }}
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

            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Annotations</span>
                  <span className="text-white font-medium">{boundingBoxes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Issue Types</span>
                  <span className="text-white font-medium">{new Set(boundingBoxes.map(b => b.issue)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage</span>
                  <span className="text-white font-medium">
                    {boundingBoxes.length > 0 ? Math.round((boundingBoxes.reduce((sum, box) => sum + Math.abs(box.width * box.height), 0) / (800 * 600)) * 100) : 0}%
                  </span>
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
