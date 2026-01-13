import React, { useState } from "react";
import { Header } from "../components/navigation/Header";

interface RewardsData {
  totalRewards: number;
  claimableRewards: number;
  dailyRewards: number;
  isConnected: boolean;
}

const PlatformRewards: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const rewardsData: RewardsData = {
    totalRewards: 2.45,
    claimableRewards: 0.892,
    dailyRewards: 0.125,
    isConnected: isWalletConnected,
  };

  const handleConnect = () => {
    setIsWalletConnected(true);
  };

  const handleClaim = () => {
    console.log("Claiming rewards:", rewardsData.claimableRewards);
  };

  const formatRewards = (amount: number) => {
    return isWalletConnected ? `${amount.toFixed(3)} SOL` : "???";
  };

  return (
    <div className="min-h-screen home-bg pt-[50px] pb-12 relative">
      <Header />

      {/* Background Cowboy Doge - Positioned behind content */}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="absolute left-0 top-[-60px] w-[400px] h-[500px] opacity-90 z-0 hidden lg:block">
          <img
            src="/images/platform.png"
            alt="Cowboy Doge"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/platform.png";
            }}
          />
        </div>
        <div className="mb-8 lg:ml-[350px]">
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 text-center lg:text-left">
            Platform Rewards
          </h1>

          {/* Rewards Info Card */}
          <div className="bg-[#2F233F] rounded-2xl p-6 lg:p-8 border border-purple-600/30 shadow-lg max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-yellow-400 text-3xl font-bold">0</span>
              <span className="text-white text-xl">In</span>
              <span className="text-purple-400 text-xl font-semibold">
                BUFFDOGE
              </span>
              <span className="text-white text-xl">Rewards Goes To Token</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white text-xl">Creators And Holders</span>
              <span className="text-purple-400 text-xl font-semibold">
                Every Day!
              </span>
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="space-y-8">
          {/* Daily Rewards Card */}
          <div className="bg-[#331B41] backdrop-blur-sm rounded-2xl p-8 lg:p-10 relative overflow-hidden shadow-xl">
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="absolute bg-white opacity-20 rounded-full"
                  style={{
                    width: `${3 + Math.random() * 4}px`,
                    height: `${3 + Math.random() * 4}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${
                      3 + Math.random() * 2
                    }s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="pb-[30px] relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white text-base font-medium">
                    Daily Grad. Reward Pot
                  </span>
                </div>

                <h2 className="text-[#9DA4AE] text-3xl lg:text-4xl font-semibold mb-2">
                  Rewards Paused
                </h2>

                <p className="text-[#9DA4AE] text-base mb-6">
                  keep an eye out for updates
                </p>

                <div className="absolute left-[-10px] bottom-[-25px] flex text-sm text-purple-300  bg-black/20 py-4 px-4 rounded-2xl w-full">
                  working on some changes to rewards - hold tight!{" "}
                  <button className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors underline">
                    learn more
                  </button>
                </div>
              </div>

              {/* Buff Doge Image */}
              <div className="flex-shrink-0 w-[300px] absolute right-[10px] bottom-[-40px] flex items-center justify-center lg:justify-end">
                <img
                  src="/images/l.png"
                  alt="Buff Doge"
                  className="w-full max-h-[250px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/doge-placeholder.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Claimable Rewards Card */}
          <div className="card-bg-new rounded-2xl p-8 lg:p-10 border border-purple-600/30 shadow-xl">
            <h3 className="text-white text-xl font-semibold mb-8">
              your claimable grad. rewards
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* User Avatar */}
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                  <img
                    src="/logo.png"
                    alt="User Avatar"
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/avatar-placeholder.png";
                    }}
                  />
                </div>

                <div>
                  <div className="text-purple-300 text-3xl font-bold mb-2">
                    {formatRewards(rewardsData.claimableRewards)}
                  </div>
                  <div className="text-gray-400 text-base">
                    {isWalletConnected
                      ? "Available to claim"
                      : "Connect wallet to view"}
                  </div>
                </div>
              </div>

              {!isWalletConnected && (
                <button
                  onClick={handleConnect}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Connect
                </button>
              )}

              {isWalletConnected && (
                <button
                  onClick={handleClaim}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Claim Rewards
                </button>
              )}
            </div>
          </div>

          {/* Earning Grad Rewards Card */}
          <div className="bg-grad-new backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-purple-600/20 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-yellow-400 text-2xl font-semibold mb-4">
                  Earning Grad. Rewards
                </h3>
                <p className="text-purple-200 text-base leading-relaxed">
                  Every Token You Hold (Or Create) At The Time Of Graduation
                  Earns You Graduation Rewards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-base transition-all shadow-lg hover:shadow-xl">
                  Trade To Earn
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold text-base transition-all border border-purple-500 shadow-lg hover:shadow-xl">
                  Create To Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformRewards;
