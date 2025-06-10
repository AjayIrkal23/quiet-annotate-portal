
import React, { useState } from 'react';
import { Upload as UploadIcon, CheckCircle, XCircle } from 'lucide-react';
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

    // Simulate upload progress
    let uploaded = 0;
    let failed = 0;

    const uploadInterval = setInterval(() => {
      const shouldFail = Math.random() < 0.1; // 10% chance of failure
      
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Image Upload</h1>
        <p className="text-gray-400">Upload images for annotation and verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-400 text-sm">
              Supports JPG, PNG, and WebP formats
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
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Upload Status</h3>
          
          {isUploading && (
            <div className="flex items-center justify-center mb-6">
              <ProgressRing progress={uploadStats.progress} size={80} strokeWidth={4} />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Files</span>
              <span className="text-white font-medium">{uploadStats.total}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Uploaded</span>
              </div>
              <span className="text-green-400 font-medium">{uploadStats.uploaded}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">Failed</span>
              </div>
              <span className="text-red-400 font-medium">{uploadStats.failed}</span>
            </div>
          </div>

          {isUploading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-300 text-sm">Processing files...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
