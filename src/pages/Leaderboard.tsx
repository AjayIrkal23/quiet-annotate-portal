import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fetchLeaderboard } from "../store/leaderboardSlice";
import LeaderboardList from "@/components/Leaderboard/LeaderboardList";
import LeaderboardSidebar from "@/components/Leaderboard/LeaderboardSidebar";
import LeaderboardHeader from "@/components/Leaderboard/LeaderboardHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

const CurrentRankCard: React.FC<{ name: string; rank: number }> = ({
  name,
  rank,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg p-4 shadow-md border border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">Your Current Rank</p>
        <p className="text-xl font-bold text-white">
          #{rank}{" "}
          <span className="text-gray-400 text-sm font-medium">({name})</span>
        </p>
      </div>
      <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-md text-sm font-semibold">
        Top {rank <= 3 ? "Performer" : "Player"}
      </div>
    </div>
  );
};
const Leaderboard: React.FC = () => {
  const dispatch = useDispatch();
  const { entries, loading, error } = useSelector(
    (state: RootState) => state.leaderboard
  );
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const currentUserName = userProfile?.name || "";

  const [showCongrats, setShowCongrats] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchLeaderboard() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!loading && entries.length > 0 && currentUserName) {
      const index = entries.findIndex(
        (e) => e.name?.toLowerCase() === currentUserName.toLowerCase()
      );
      if (index !== -1) {
        const rank = index + 1;
        setUserRank(rank);

        if (rank <= 3) {
          setTimeout(() => {
            setShowCongrats(true);
            triggerConfetti();
          }, 800);
        }
      }
    }
  }, [loading, entries, currentUserName]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-red-400 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <LeaderboardHeader />

        {userRank && (
          <div className="mb-6">
            <CurrentRankCard name={currentUserName} rank={userRank} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <LeaderboardList entries={entries} />
          </div>
          <LeaderboardSidebar entries={entries} />
        </div>
      </div>

      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none text-white rounded-2xl shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400 text-2xl font-bold">
              <Trophy className="w-6 h-6" /> Congratulations!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-300 text-lg">
            Amazing work,{" "}
            <span className="text-yellow-400 font-bold">{currentUserName}</span>
            ! You’ve secured{" "}
            <span className="text-yellow-400 font-bold">Rank #{userRank} </span>
            on the leaderboard! 🏆 Keep it up!
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Leaderboard;
