import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Zap, Shield, Heart, Award, Sparkles, CheckCircle, Rocket } from "lucide-react";

interface MotivationPopupProps {
  open: boolean;
  onClose: () => void;
  imageCount: number;
}

const motivationMessages = [
  {
    icon: Shield,
    title: "Safety Champion!",
    message: "You're improving workplace safety with every annotation!",
    gradient: "from-emerald-400 to-cyan-400"
  },
  {
    icon: Star,
    title: "Amazing Progress!",
    message: "Your attention to detail is making a real difference!",
    gradient: "from-purple-400 to-pink-400"
  },
  {
    icon: Target,
    title: "On Target!",
    message: "Every violation you identify helps prevent accidents!",
    gradient: "from-blue-400 to-indigo-400"
  },
  {
    icon: Zap,
    title: "Powered Up!",
    message: "You're on fire! Keep up the fantastic work!",
    gradient: "from-yellow-400 to-orange-400"
  },
  {
    icon: Trophy,
    title: "Excellence Achieved!",
    message: "Your dedication to safety is truly inspiring!",
    gradient: "from-gold-400 to-yellow-400"
  },
  {
    icon: Heart,
    title: "Making Impact!",
    message: "Each annotation brings us closer to zero accidents!",
    gradient: "from-red-400 to-pink-400"
  },
  {
    icon: Award,
    title: "Quality Expert!",
    message: "Your precise annotations are building safer workplaces!",
    gradient: "from-emerald-400 to-teal-400"
  },
  {
    icon: Sparkles,
    title: "Brilliant Work!",
    message: "You're creating a legacy of workplace safety!",
    gradient: "from-purple-400 to-violet-400"
  },
  {
    icon: CheckCircle,
    title: "Mission Progress!",
    message: "Every image annotated is a step toward safer tomorrow!",
    gradient: "from-green-400 to-emerald-400"
  },
  {
    icon: Rocket,
    title: "Unstoppable!",
    message: "Your commitment to safety excellence is remarkable!",
    gradient: "from-blue-400 to-purple-400"
  }
];

const MotivationPopup: React.FC<MotivationPopupProps> = ({
  open,
  onClose,
  imageCount
}) => {
  const messageIndex = Math.floor((imageCount - 1) / 10) % motivationMessages.length;
  const currentMessage = motivationMessages[messageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl">
        <div className="text-center py-6">
          {/* Icon with gradient background */}
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${currentMessage.gradient} flex items-center justify-center`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentMessage.title}
          </h2>
          
          {/* Message */}
          <p className="text-gray-300 mb-4 text-lg">
            {currentMessage.message}
          </p>
          
          {/* Progress indicator */}
          <div className="mb-6">
            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${currentMessage.gradient} text-white font-medium text-sm`}>
              {imageCount} Images Annotated! 🎉
            </div>
          </div>
          
          {/* Continue button */}
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-2 rounded-lg font-medium transition-all duration-200"
          >
            Keep Going!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MotivationPopup;