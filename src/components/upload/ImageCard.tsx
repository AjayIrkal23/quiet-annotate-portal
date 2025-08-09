import React from "react";
import { UploadedImage } from "@/store/uploadSlice";
import { BASEURL } from "@/lib/utils";

interface ImageCardProps {
  image: UploadedImage;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  return (
    <div
      className={`relative border rounded-lg cursor-pointer overflow-hidden ${
        image.isIssueGenerated ? "border-green-500/30" : "border-orange-500/30"
      }`}
      onClick={onClick}
    >
      <img
        src={`${BASEURL}/${image.imagePath}`}
        alt={image.imageName}
        className="w-full h-48 object-cover"
      />
      <div className="p-2 bg-gray-800/50">
        <p className="text-white text-sm truncate">{image.imageName}</p>
        <p className="text-gray-400 text-xs">
          Issues: {image.violationDetails?.length || 0}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
