import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, ChevronLeft, ChevronRight, Trash2, Save } from "lucide-react";
import { BASEURL } from "@/lib/utils";
import axios from "axios";

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
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onSaved?: () => void;
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

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, image, onNext, onPrevious, hasNext, hasPrevious, onSaved }) => {
  const [loaded, setLoaded] = useState(false);
  const [localViolations, setLocalViolations] = useState<Violation[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setLocalViolations(image?.violationDetails || []);
  }, [image]);

  if (!image) return null;

  const handleDelete = (index: number) => {
    setLocalViolations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { ...image, violationDetails: localViolations };
      await axios.post(`${BASEURL}/images/saveitem`, payload);
      onSaved?.();
      onClose();
    } catch (e) {
      console.error("Failed to save image item", e);
    } finally {
      setSaving(false);
    }
  };

  const violationsCount = localViolations?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Safety Issues Detected</span>
            </DialogTitle>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                <div className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Prev</div>
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                <div className="flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></div>
              </button>
            </div>
          </div>
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
                image.isIssueGenerated ? "border-green-500" : "border-orange-500"
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Detected Issues ({violationsCount})
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            {violationsCount ? (
              localViolations.map((violation, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
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
                            : violation.severity === "low"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-700/20 text-red-300"
                        }`}
                      >
                        {violation.severity} severity
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Delete violation"
                      title="Delete violation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
