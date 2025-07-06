
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setUploadedImages } from '../store/uploadSlice';
import { Upload as UploadIcon, FileArchive, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ImageGrid from '../components/upload/ImageGrid';

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  const dispatch = useDispatch();
  const uploadedImages = useSelector((state: RootState) => state.upload.uploadedImages);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    // Simulate image processing and adding to Redux store
    const imagePromises = selectedFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const imageUrls = await Promise.all(imagePromises);
      const newImages = imageUrls.map((url, index) => ({
        _id: {
          $oid: (Date.now() + index).toString()
        },
        imagePath: url,
        imageName: selectedFiles[index].name,
        violationDetails: [],
        createdAt: {
          $date: new Date().toISOString()
        },
        updatedAt: {
          $date: new Date().toISOString()
        },
        __v: 0
      }));

      dispatch(setUploadedImages([...uploadedImages, ...newImages]));
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const totalPages = Math.ceil(uploadedImages.length / imagesPerPage);
  const currentImages = uploadedImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <UploadIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            Image Uploader
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Upload images for annotation and processing
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Upload New Images</h2>
          <div className="text-gray-400">{selectedFiles.length} files selected</div>
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="upload-input" className="cursor-pointer">
            <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center space-x-2">
              <FileArchive className="w-4 h-4" />
              <span>Select Files</span>
            </div>
            <input
              id="upload-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </label>

          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {uploadSuccess && (
          <div className="mt-4 flex items-center text-green-400 space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Upload successful!</span>
          </div>
        )}
      </div>

      {/* Image Gallery Section */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Uploaded Images</h2>
          <div className="text-gray-400">{uploadedImages.length} images</div>
        </div>

        {uploadedImages.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl text-center text-gray-400">
            No images uploaded yet.
          </div>
        ) : (
          <ImageGrid
            images={currentImages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Upload;
