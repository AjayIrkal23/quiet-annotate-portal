import React from "react";

import RewardsList from "./RewardsList";
import TopPerformers from "./TopPerformers";

const LeaderboardSidebar = ({ entries }) => (
  <div className="space-y-6">
    <TopPerformers entries={entries} />
    <RewardsList />
  </div>
);

export default LeaderboardSidebar;
