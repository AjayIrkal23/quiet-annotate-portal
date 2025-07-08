import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { BASEURL } from "@/lib/utils";

interface Violation {
  name: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface ImageCardProps {
  image: {
    _id?: string;
    imagePath: string;
    imageName: string;
    violationDetails: Violation[];
  };
  onClick: () => void;
  isCorrect?: boolean; // ✅ Optional if not always passed
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  console.log(image);

  return (
    <div
      key={image._id}
      className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/40 rounded-lg z-10">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      <img
        src={`${BASEURL}/${image.imagePath}`}
        alt={image.imageName}
        onLoad={() => setLoaded(true)}
        className={`w-full h-60 object-cover rounded-lg shadow-md ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      />

      {image.violationDetails?.length > 0 && (
        <div className="absolute top-2 right-2 bg-red-600 shadow-lg text-white text-xs rounded-full px-2 py-1 font-bold z-20">
          {image.violationDetails.length}{" "}
          {image.violationDetails.length === 1 ? "issue" : "issues"}
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
        <AlertTriangle className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default ImageCard;
