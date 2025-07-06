import React from 'react';
import { ImageData } from '@/types/annotationTypes';
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ImageGridProps {
  images: ImageData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image._id.$oid} className="relative">
            <img
              src={image.imagePath}
              alt={image.imageName}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-sm rounded-md px-2 py-1">
              {image.imageName}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ImageGrid;
