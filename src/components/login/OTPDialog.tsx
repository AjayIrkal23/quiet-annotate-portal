// OTPDialog.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AppDispatch, RootState } from "@/store/store";
import { verifyUser } from "@/store/thunks/userThunks";

interface OTPDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  onOpenChange,
  email,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, profile } = useSelector((state: RootState) => state.user);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    console.log(email, code);
    try {
      const resultAction = await dispatch(verifyUser({ email, code }));
      if (verifyUser.rejected.match(resultAction)) {
        setError((resultAction.payload as string) || "Verification failed");
      } else if (verifyUser.fulfilled.match(resultAction)) {
        onOpenChange(false);
        setCode("");
        alert("Account verified successfully! You can now log in.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Verify Your Account</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Enter the verification code sent to your email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-pink-500 hover:from-emerald-600 hover:to-pink-600 text-white font-semibold"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
