import React from "react";

const HolderRewardsHeader: React.FC = () => {
  return (
    <div className="holder-grad rounded-2xl p-6  relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-white text-3xl lg:text-4xl font-normal mb-3 tracking-[8px]">
            HOLDER REWARDS
          </h1>
          <p className="text-purple-200 text-sm  leading-relaxed">
            Hold Ur Fav Cults With Conviction To Automatically Earn Passive Sol
          </p>
          <p className="text-purple-200 text-sm mb-6">Rewards! ◕(◉◡◉)◕</p>

          <div className="space-y-2">
            <p className="golden-text text-sm font-medium">
              Total Rewards Distributed To Date
            </p>
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full  overflow-hidden flex items-center justify-center">
                <img src="./images/sol-grad.png" alt="solana" />
              </div>
              <span className="golden-text text-shadow-sm text-5xl font-bold">
                998.092
              </span>
            </div>
          </div>
        </div>

        {/* Buff Doge Image */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
          <img
            src="/images/l.png"
            alt="Buff Doge"
            className="w-32 h-32 lg:w-40 lg:h-40 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/doge-placeholder.png";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HolderRewardsHeader;
