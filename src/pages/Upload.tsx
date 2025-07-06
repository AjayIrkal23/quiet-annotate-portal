
import React, { useState } from 'react';
import { Upload as UploadIcon, CheckCircle, XCircle, FileArchive, Image as ImageIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setTotalZipFiles, setIsUploading } from '@/store/uploadSlice';
import ProgressRing from '../components/ProgressRing';
import ImageGrid from '../components/ImageGrid';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UploadStats {
  total: number;
  uploaded: number;
  failed: number;
  progress: number;
}

const Upload = () => {
  const dispatch = useDispatch();
  const { uploadedImages, currentPage, imagesPerPage, totalZipFiles, isUploading } = useSelector((state: RootState) => state.upload);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats>({
    total: 0,
    uploaded: 0,
    failed: 0,
    progress: 0
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
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.zip') || file.name.endsWith('.rar')
    );
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    
    dispatch(setIsUploading(true));
    setUploadStats({
      total: files.length,
      uploaded: 0,
      failed: 0,
      progress: 0
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

      const progress = Math.round((uploaded + failed) / files.length * 100);
      
      setUploadStats({
        total: files.length,
        uploaded,
        failed,
        progress
      });

      if (uploaded + failed >= files.length) {
        clearInterval(uploadInterval);
        dispatch(setTotalZipFiles(totalZipFiles + uploaded));
        setTimeout(() => dispatch(setIsUploading(false)), 1000);
      }
    }, 200);
  };

  // Pagination logic
  const totalPages = Math.ceil(uploadedImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = uploadedImages.slice(startIndex, endIndex);

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
          Upload ZIP files containing images for AI-powered safety violation analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Upload Area */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-blue-500 bg-blue-500/10 transform scale-105' 
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/20'
          }`} 
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleDrop}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileArchive className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Drop ZIP files here or click to browse
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Supports ZIP and RAR formats • Max 100MB per file
            </p>
            <input 
              type="file" 
              multiple 
              accept=".zip,.rar" 
              className="hidden" 
              onChange={e => handleFileUpload(Array.from(e.target.files || []))} 
              id="file-upload" 
            />
            <label htmlFor="file-upload" className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 font-medium">
              <UploadIcon className="w-4 h-4" />
              <span>Select ZIP Files</span>
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
                  <FileArchive className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 font-medium">Total ZIP Files</span>
                </div>
                <span className="text-white font-bold text-lg">{totalZipFiles}</span>
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

      {/* Uploaded Images with Analysis */}
      <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            Uploaded Images with Analysis
          </h2>
        </div>
        <p className="text-gray-400 font-medium text-sm mb-8">
          {uploadedImages.length} images analyzed • Showing {startIndex + 1}-{Math.min(endIndex, uploadedImages.length)} of {uploadedImages.length}
        </p>

        {uploadedImages.length > 0 ? (
          <>
            <ImageGrid images={currentImages} />
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            dispatch({ type: 'upload/setCurrentPage', payload: currentPage - 1 });
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch({ type: 'upload/setCurrentPage', payload: pageNum });
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            dispatch({ type: 'upload/setCurrentPage', payload: currentPage + 1 });
                          }
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-2">No Images Analyzed Yet</h3>
            <p className="text-gray-400 text-sm">Upload ZIP files containing images to see the analysis results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
