import React from "react";
import { Header } from "../components/navigation/Header";
import TempleHeader from "../components/temple/TempleHeader";
import PrizesSection from "../components/temple/PrizeSection";
import EligibleCults from "../components/temple/EligibleCults";

const TempleToMoon: React.FC = () => {
  return (
    <div className="min-h-screen home-bg pt-[100px] pb-8">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <TempleHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PrizesSection />
          <div className="bg-[#271431] rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              the path to the temple
            </h3>
            {/* Chart placeholder - you can integrate your preferred chart library */}
            <div className="h-64 bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Chart Component</span>
            </div>
          </div>
        </div>
        <EligibleCults />
      </div>
    </div>
  );
};

export default TempleToMoon;
