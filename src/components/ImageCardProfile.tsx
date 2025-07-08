import React from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BASEURL } from "@/lib/utils";

export interface ValidatedImage {
  imagePath: string;
  employeeId: string;
  imageName: string;
  details: {
    violationName: string;
    description: string;
    isValid: boolean | null;
  }[];
}

const ImageCard: React.FC<{
  image: ValidatedImage;
  isCorrect: boolean;
}> = ({ image, isCorrect }) => {
  return (
    <div className="group relative">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={`${BASEURL}/boundingBox/${image.employeeId}/${image.imagePath}`}
            alt={image.imageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div
            className={`absolute top-2 right-2 ${
              isCorrect ? "bg-green-500" : "bg-red-500"
            } text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1`}
          >
            {isCorrect ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>{image.details?.length ?? 0}</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">
                  {image.imageName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <Zoom>
                    <img
                      src={`${BASEURL}/boundingBox/${image.employeeId}/${image.imagePath}`}
                      alt={image.imageName}
                      className="w-full max-h-[60vh] object-contain rounded"
                    />
                  </Zoom>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">
                    Validation Results
                  </h4>

                  {image.details?.map((violation, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center mt-1">
                          {violation.isValid === true ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : violation.isValid === false ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 ml-3">
                          <h5 className="font-medium text-white mb-1">
                            {violation.violationName}
                          </h5>
                          <p className="text-gray-300 text-sm mb-2">
                            {violation.description}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              violation.isValid === true
                                ? "bg-green-500/20 text-green-400"
                                : violation.isValid === false
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {violation.isValid === true
                              ? "VALID"
                              : violation.isValid === false
                              ? "INVALID"
                              : "UNVERIFIED"}
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

        <div className="p-4">
          <h3 className="text-white font-medium text-sm truncate mb-2">
            {image.imageName}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>ID: {image.employeeId}</span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{image.details?.length ?? 0} violations</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
