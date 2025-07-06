
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

interface Issue {
  value: string;
  label: string;
  color: string;
}

interface IssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIssue: (issue: string) => void;
  issues: Issue[];
  onAddIssue: (issue: Issue) => void;
  onRemoveIssue: (issueValue: string) => void;
}

const IssueDialog: React.FC<IssueDialogProps> = ({
  open,
  onOpenChange,
  onSelectIssue,
  issues,
  onAddIssue,
  onRemoveIssue
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [newIssueName, setNewIssueName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (!open) {
      setSelectedIssue('');
      setNewIssueName('');
      setShowAddForm(false);
    }
  }, [open]);

  const handleSelectIssue = () => {
    if (selectedIssue) {
      onSelectIssue(selectedIssue);
      onOpenChange(false);
    }
  };

  const handleAddIssue = () => {
    if (newIssueName.trim()) {
      const newIssue: Issue = {
        value: newIssueName.toLowerCase().replace(/\s+/g, '_'),
        label: newIssueName,
        color: '#f59e0b'
      };
      onAddIssue(newIssue);
      setNewIssueName('');
      setShowAddForm(false);
    }
  };

  const customIssues = issues.filter(issue => 
    !['pothole', 'crack', 'debris', 'marking', 'sign', 'other'].includes(issue.value)
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Select Issue Type</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Choose an issue type for this annotation or add a new one.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Select value={selectedIssue} onValueChange={setSelectedIssue}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {issues.map(issue => (
                <SelectItem key={issue.value} value={issue.value} className="text-white hover:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: issue.color }} />
                    <span>{issue.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showAddForm ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter new issue name"
                value={newIssueName}
                onChange={(e) => setNewIssueName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddIssue}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Issue</span>
            </button>
          )}

          {customIssues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Custom Issues:</h4>
              {customIssues.map(issue => (
                <div key={issue.value} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: issue.color }} />
                    <span className="text-sm">{issue.label}</span>
                  </div>
                  <button
                    onClick={() => onRemoveIssue(issue.value)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSelectIssue}
            disabled={!selectedIssue}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Select Issue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IssueDialog;
