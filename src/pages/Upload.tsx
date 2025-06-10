
import React, { useState } from 'react';
import { Upload as UploadIcon, CheckCircle, XCircle, FileImage, Zap, TrendingUp } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';

interface UploadStats {
  total: number;
  uploaded: number;
  failed: number;
  progress: number;
}

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats>({
    total: 0,
    uploaded: 0,
    failed: 0,
    progress: 0,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStats({
      total: files.length,
      uploaded: 0,
      failed: 0,
      progress: 0,
    });

    let uploaded = 0;
    let failed = 0;

    const uploadInterval = setInterval(() => {
      const shouldFail = Math.random() < 0.1;
      
      if (shouldFail) {
        failed++;
      } else {
        uploaded++;
      }

      const progress = Math.round(((uploaded + failed) / files.length) * 100);

      setUploadStats({
        total: files.length,
        uploaded,
        failed,
        progress,
      });

      if (uploaded + failed >= files.length) {
        clearInterval(uploadInterval);
        setTimeout(() => setIsUploading(false), 1000);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <UploadIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            Upload Center
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Upload and process images for AI-powered annotation and verification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 transform scale-105'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Supports JPG, PNG, and WebP formats • Max 10MB per file
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Select Files</span>
            </label>
          </div>
        </div>

        {/* Upload Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-md"></div>
            <h3 className="text-xl font-bold text-white">Upload Status</h3>
          </div>
          
          {isUploading && (
            <div className="flex items-center justify-center mb-8">
              <ProgressRing progress={uploadStats.progress} size={100} strokeWidth={6} />
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileImage className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 font-medium">Total Files</span>
                </div>
                <span className="text-white font-bold text-lg">{uploadStats.total}</span>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 font-medium">Uploaded</span>
                </div>
                <span className="text-green-400 font-bold text-lg">{uploadStats.uploaded}</span>
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 font-medium">Failed</span>
                </div>
                <span className="text-red-400 font-bold text-lg">{uploadStats.failed}</span>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-6 py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-blue-400 font-medium">Processing files...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2.3s</p>
              <p className="text-gray-400 text-sm">Avg Processing Time</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">98.5%</p>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-gray-400 text-sm">Files Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
