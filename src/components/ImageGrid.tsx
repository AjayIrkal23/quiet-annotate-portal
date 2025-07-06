
import React, { useState } from 'react';
import { UploadedImage } from '@/store/uploadSlice';
import { AlertTriangle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageGridProps {
  images: UploadedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {images.map((image) => (
        <div key={image._id.$oid} className="group relative">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={image.imagePath}
                alt={image.imageName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Violation Count Overlay */}
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{image.violationDetails.length}</span>
              </div>

              {/* View Details Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white text-lg">{image.imageName}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={image.imagePath}
                        alt={image.imageName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">Safety Violations Detected</h4>
                      {image.violationDetails.map((violation, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                          <div className="flex items-start space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                              style={{ backgroundColor: getSeverityColor(violation.severity) }} 
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-white mb-1">{violation.name}</h5>
                              <p className="text-gray-300 text-sm mb-2">{violation.description}</p>
                              <span 
                                className="text-xs font-medium px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${getSeverityColor(violation.severity)}20`,
                                  color: getSeverityColor(violation.severity)
                                }}
                              >
                                {violation.severity.toUpperCase()} SEVERITY
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm truncate mb-2">{image.imageName}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(image.createdAt.$date).toLocaleDateString()}
                </span>
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{image.violationDetails.length} issues</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
