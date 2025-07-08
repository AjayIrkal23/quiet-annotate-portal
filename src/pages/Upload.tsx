import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setIsUploading } from "../store/uploadSlice";

import { fetchImageStats } from "@/store/thunks/imageStatsThunk";
import { fetchPaginatedImages } from "@/store/thunks/fetchPaginatedImages";
import { uploadZipThunk } from "@/store/thunks/uploadZipThunk";

import { Upload as UploadIcon, FileArchive, Image } from "lucide-react";

import StatusCard from "../components/StatusCard";
import ImageCard from "@/components/upload/ImageCard";
import ImageModal from "@/components/upload/ImageModal";

import { UploadedImage } from "@/store/uploadSlice";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(
    null
  );
  const [showImageModal, setShowImageModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 30;

  const dispatch = useDispatch();
  const {
    uploadedImages,
    totalZipFiles,
    isUploading,
    imageCount,
  } = useSelector((state: RootState) => state.upload);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const zipFiles = Array.from(e.target.files).filter((file) =>
      file.name.endsWith(".zip")
    );

    if (zipFiles.length === 0) return;

    dispatch(setIsUploading(true));

    try {
      for (const zip of zipFiles) {
        await dispatch<any>(uploadZipThunk(zip));
      }
      await dispatch<any>(fetchImageStats());
      await dispatch<any>(fetchPaginatedImages({ page: 1, limit }));
      setPage(1);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      dispatch(setIsUploading(false));
    }
  };

  const getPaginationRange = (page: number, totalPages: number) => {
    const range: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (page > 3) range.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) range.push(i);

      if (page < totalPages - 2) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  useEffect(() => {
    dispatch<any>(fetchImageStats());
    dispatch<any>(fetchPaginatedImages({ page, limit }));
  }, [dispatch, page]);

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const totalPages = Math.ceil(imageCount / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatusCard
          title="Total Zip Files"
          value={totalZipFiles}
          icon={FileArchive}
          delay={0}
        />
        <StatusCard
          title="Total Images"
          value={imageCount}
          icon={Image}
          delay={200}
        />
      </div>

      {/* Upload Form */}
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-8 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Upload Zip Files</h2>
          {isUploading && (
            <div className="text-orange-400 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>

        <label htmlFor="upload-input" className="cursor-pointer">
          <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center space-x-2 w-fit">
            <FileArchive className="w-4 h-4" />
            <span>Select Zip Files</span>
          </div>
          <input
            id="upload-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".zip"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Image Grid */}
      <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Processed Images</h2>
          <div className="text-gray-400">{uploadedImages.length} images</div>
        </div>

        {uploadedImages.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl text-center text-gray-400">
            No images processed yet. Upload zip files to get started.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image) => (
                <ImageCard
                  key={image._id}
                  image={image}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-300 font-medium px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <ImageModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        image={selectedImage}
      />
    </div>
  );
};

export default Upload;
