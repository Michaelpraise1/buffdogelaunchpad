import React from "react";
import { Header } from "../components/navigation/Header";
import HolderRewardsHeader from "../components/holder/HolderRewardsHeader";
import RewardsReceived from "../components/holder/RewardsRecieved";
import RewardsTable from "../components/holder/RewardsTable";

const HolderRewards: React.FC = () => {
  return (
    <div className="min-h-screen home-bg pt-[50px] pb-8">
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <HolderRewardsHeader />
        <RewardsReceived />
        <RewardsTable />
      </div>
    </div>
  );
};

export default HolderRewards;
