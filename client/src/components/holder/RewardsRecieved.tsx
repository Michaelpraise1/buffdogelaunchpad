import React, { useState } from "react";

const RewardsReceived: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnect = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="bg-[#331A40] rounded-2xl p-6 smooth-borders">
      <h3 className="text-white text-lg font-semibold mb-4">
        Your Holder Rewards Received
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center">
            <img src="./images/solana.png" alt="solana" />
          </div>
          <div>
            <div className="text-white text-2xl font-bold">
              {isWalletConnected ? "0.00" : "??"}
            </div>
            <div className="text-gray-400 text-sm">
              Received To Date ({isWalletConnected ? "0" : "??"})
            </div>
          </div>
        </div>

        {!isWalletConnected && (
          <button
            onClick={handleConnect}
            className="bg-white hover:bg-slate-100 text-gray-900 px-6 py-2 rounded-full font-semibold text-sm transition-all"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardsReceived;
