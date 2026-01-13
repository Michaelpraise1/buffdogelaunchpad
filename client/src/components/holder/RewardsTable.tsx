import React, { useState } from "react";

interface RewardToken {
  cult: string;
  symbol: string;
  avatar: string;
  rewards: number;
  usdValue: number;
}

const DEMO_REWARDS: RewardToken[] = [
  {
    cult: "Fucked Up My Bag Lost Everything",
    symbol: "FUMBLE",
    avatar: "/images/PINK.png",
    rewards: 354.893837,
    usdValue: 0,
  },
  {
    cult: "Roadmap Coin",
    symbol: "ROAP",
    avatar: "/images/YEL.png",
    rewards: 107.822874,
    usdValue: 316.426,
  },
  {
    cult: "Wuff",
    symbol: "WUFF",
    avatar: "/images/PINK.png",
    rewards: 89.043208,
    usdValue: 515.052,
  },
  {
    cult: "CREO",
    symbol: "CREO",
    avatar: "/images/YEL.png",
    rewards: 57.025064,
    usdValue: 310.278,
  },
  {
    cult: "NEUTRAL COIN",
    symbol: "NEUTRAL",
    avatar: "/images/PINK.png",
    rewards: 51.580257,
    usdValue: 319.568,
  },
  {
    cult: "poop",
    symbol: "poop",
    avatar: "/images/YEL.png",
    rewards: 48.8988,
    usdValue: 318.405,
  },
  {
    cult: "HOLD THIS COIN TO MAKE MONEY",
    symbol: "HOLD",
    avatar: "/images/PINK.png",
    rewards: 38.683228,
    usdValue: 316.87,
  },
  {
    cult: "BUFFDOGE",
    symbol: "BUFFDOGE",
    avatar: "/images/YEL.png",
    rewards: 26.486772,
    usdValue: 54.174,
  },
  {
    cult: "SOLDIEGO",
    symbol: "SDOG",
    avatar: "/images/PINK.png",
    rewards: 20.981273,
    usdValue: 38.719,
  },
  {
    cult: "Project P8",
    symbol: "P8",
    avatar: "/images/YEL.png",
    rewards: 18.244309,
    usdValue: 0,
  },
];

const RewardsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"your" | "global">("your");
  const [showAll, setShowAll] = useState(false);

  const displayedRewards = showAll ? DEMO_REWARDS : DEMO_REWARDS.slice(0, 6);

  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="bg-[#331A40] rounded-2xl p-6 smooth-borders">
      <h3 className="text-white text-lg font-semibold mb-6">
        Holder Rewards To Date
      </h3>

      {/* Toggle Tabs */}
      <div className="flex gap-2 mb-6 w-full p-1  rounded-full cursor-pointer ">
        <button
          onClick={() => setActiveTab("your")}
          className={`w-[50%] px-6 py-2 rounded-full font-semibold text-sm border-yellow-400 transition-all ${
            activeTab === "your"
              ? "bg-yellow-400 text-black"
              : "bg-transparent border border-gray-600 text-gray-300 "
          }`}
        >
          Your Rewards
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`w-[50%] px-6 py-2 rounded-full font-semibold text-sm border-yellow-400 transition-all ${
            activeTab === "global"
              ? "bg-yellow-400 text-black"
              : "bg-transparent border border-gray-600 text-gray-300 "
          }`}
        >
          Global
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-2 gap-4 text-gray-400 text-xs font-medium mb-4 px-2">
        <div>Cult</div>
        <div className="text-right">SOL</div>
      </div>

      {/* Rewards List */}
      <div className="space-y-3">
        {displayedRewards.map((reward, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 px-2  rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={reward.avatar}
                alt={reward.symbol}
                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm truncate">
                  {reward.cult}
                </div>
                <div className="text-purple-400 text-xs">{reward.symbol}</div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-white font-bold text-sm">
                {formatNumber(reward.rewards)}
              </div>
              <div className="text-gray-400 text-xs">
                ${formatNumber(reward.usdValue)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!showAll && DEMO_REWARDS.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardsTable;
