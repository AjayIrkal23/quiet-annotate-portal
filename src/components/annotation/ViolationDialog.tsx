import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViolationDetail } from "@/types/annotationTypes";

interface ViolationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectViolation: (violationName: string) => void;
  violations: ViolationDetail[];
  getSeverityColor: (severity: string) => string;
}

const ViolationDialog: React.FC<ViolationDialogProps> = ({
  open,
  onOpenChange,
  onSelectViolation,
  violations,
  getSeverityColor
}) => {
  const [selectedViolation, setSelectedViolation] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setSelectedViolation('');
    }
  }, [open]);

  const handleSelectViolation = () => {
    if (selectedViolation) {
      onSelectViolation(selectedViolation);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Select Violation Type</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Choose which violation this bounding box represents. Only unannotated violations are shown.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Select value={selectedViolation} onValueChange={setSelectedViolation}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select violation type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {violations.map(violation => (
                <SelectItem key={violation.name} value={violation.name} className="text-white hover:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getSeverityColor(violation.severity) }} 
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{violation.name}</span>
                      <span className="text-xs text-gray-400">{violation.severity} severity</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedViolation && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">
                <strong>Description:</strong>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {violations.find(v => v.name === selectedViolation)?.description}
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSelectViolation}
            disabled={!selectedViolation}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Select Violation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ViolationDialog;
