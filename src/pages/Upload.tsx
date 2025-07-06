
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setUploadedImages, setTotalZipFiles } from '../store/uploadSlice';
import { Upload as UploadIcon, FileArchive, Image, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusCard from '../components/StatusCard';

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const dispatch = useDispatch();
  const { uploadedImages, totalZipFiles } = useSelector((state: RootState) => state.upload);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(file => 
      file.name.endsWith('.zip') || file.type.startsWith('image/')
    );
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setUploading(true);
    
    // Simulate zip file processing
    const zipFiles = selectedFiles.filter(file => file.name.endsWith('.zip'));
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    // Process image files
    const imagePromises = imageFiles.map(file => {
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
        imageName: imageFiles[index].name,
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
      dispatch(setTotalZipFiles(totalZipFiles + zipFiles.length));
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
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
            Zip File Uploader
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Upload zip files containing images for safety analysis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatusCard
          title="Total Zip Files"
          value={totalZipFiles}
          icon={FileArchive}
          delay={0}
        />
        <StatusCard
          title="Total Images"
          value={uploadedImages.length}
          icon={Image}
          delay={200}
        />
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Upload Zip Files</h2>
          <div className="text-gray-400">{selectedFiles.length} files selected</div>
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="upload-input" className="cursor-pointer">
            <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center space-x-2">
              <FileArchive className="w-4 h-4" />
              <span>Select Zip Files</span>
            </div>
            <input
              id="upload-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".zip,image/*"
            />
          </label>

          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {uploading ? "Processing..." : "Upload & Process"}
          </Button>
        </div>
      </div>

      {/* Uploaded Images Grid */}
      <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Processed Images</h2>
          <div className="text-gray-400">{uploadedImages.length} images</div>
        </div>

        {uploadedImages.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl text-center text-gray-400">
            No images processed yet. Upload zip files to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div 
                key={image._id.$oid} 
                className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.imagePath}
                  alt={image.imageName}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-sm rounded-md px-2 py-1">
                  {image.imageName}
                </div>
                {image.violationDetails.length > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {image.violationDetails.length}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Safety Issues Detected</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.imagePath}
                  alt={selectedImage.imageName}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-sm rounded-md px-2 py-1">
                  {selectedImage.imageName}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Detected Issues ({selectedImage.violationDetails.length})
                </h3>
                
                {selectedImage.violationDetails.length === 0 ? (
                  <p className="text-gray-400">No safety issues detected in this image.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedImage.violationDetails.map((violation: any, index: number) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getSeverityColor(violation.severity) }}
                          />
                          <h4 className="font-medium text-white">{violation.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            violation.severity === 'high' 
                              ? 'bg-red-500/20 text-red-400' 
                              : violation.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {violation.severity} severity
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{violation.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
