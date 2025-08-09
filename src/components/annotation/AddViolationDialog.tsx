import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ViolationDetail } from "@/types/annotationTypes";

interface AddViolationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (violation: ViolationDetail) => void;
}

const AddViolationDialog: React.FC<AddViolationDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<string>("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setSeverity("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim() || !severity || !description.trim()) return;
    const violation: ViolationDetail = {
      name: name.trim(),
      severity: severity.toLowerCase() as ViolationDetail["severity"],
      isHumanAdded: true,
      description: description.trim(),
    };
    onSubmit(violation);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Violation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Violation name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Missing Safety Gloves"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Severity</label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                <SelectItem value="CRITICAL" className="text-white">
                  CRITICAL
                </SelectItem>
                <SelectItem value="HIGH" className="text-white">
                  HIGH
                </SelectItem>
                <SelectItem value="MEDIUM" className="text-white">
                  MEDIUM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the violation so others understand it"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || !severity || !description.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddViolationDialog;
