import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { BASEURL } from "@/lib/utils";

interface Violation {
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
}

interface ImageData {
  _id?: string;
  imagePath: string;
  imageName: string;
  violationDetails: Violation[] | null;
  isIssueGenerated: boolean;
}

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  image: ImageData | null;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "#b91c1c";
    case "high":
      return "#ef4444";
    case "medium":
      return "#f97316";
    case "low":
      return "#eab308";
    default:
      return "#6b7280";
  }
};

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, image }) => {
  const [loaded, setLoaded] = useState(false);

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>Safety Issues Detected</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image with loader */}
          <div className="relative">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700/30 rounded-lg z-10">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
            <div
              className={`border-2 rounded-lg ${
                image.isIssueGenerated
                  ? "border-green-500"
                  : "border-orange-500"
              }`}
            >
              <img
                src={`${BASEURL}/${image.imagePath}`}
                alt={image.imageName}
                onLoad={() => setLoaded(true)}
                className={`w-full max-h-[450px] object-contain rounded-lg transition-opacity duration-300 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
          {/* Violations */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              Detected Issues ({image.violationDetails?.length || 0})
            </h3>
            {image.violationDetails?.length ? (
              image.violationDetails.map((violation, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getSeverityColor(violation.severity),
                      }}
                    />
                    <h4 className="font-medium text-white">{violation.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        violation.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : violation.severity === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {violation.severity} severity
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {violation.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                {image.isIssueGenerated
                  ? "No Issues Found"
                  : "AI AGENT IS DETECTING ISSUES"}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
