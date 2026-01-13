import React from "react";
import { useNavigate } from "react-router-dom";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  timeAgo: string;
  image: string;
  mcap: number;
  mcapChange: number;
  volume24h: number;
  volumeChange: number;
  price: number;
  createdBy: string;
  createdByAvatar: string;
  verified?: boolean;
  progress: number; // Progress percentage for vertical bar (0-100)
  borderColor: "yellow" | "pink" | "orange" | "purple";
}

interface TokenCardProps {
  token: TokenData;
  onClick?: (token: TokenData) => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(token);
    navigate(`/token/${token.id}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number): string => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
  };

  return (
    <div
      className="relative pl-[30px] w-[280px] h-[435px] bg-[#2B1F3B] rounded-2xl overflow-hidden border-2 border-[#FFC107] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={handleClick}
    >
      {/* Vertical Progress Bar */}
      <div className="absolute left-[8px] top-[7%] w-[22px] h-[90%] bg-purple-900/50 rounded-full border border-white/5 overflow-hidden">
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-400 to-yellow-200 transition-all duration-1000"
          style={{ height: `${token.progress}%` }}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-[-90deg] text-white text-[10px] font-black tracking-tighter drop-shadow-md">
          {Math.round(token.progress)}%
        </div>
      </div>

      {/* Top-left Doge Icon */}
      <div className="absolute top-[1.3%] left-[10px] z-20">
        <div className="w-8 h-8 items-center justify-center">
          <img
            src="/images/r.png"
            alt="Doge"
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>

      {/* Token Image Section - White Background */}
      <div className="w-full h-[230px]   mx-3  rounded-t-xl flex items-center justify-center">
        <img
          src={token.image}
          alt={token.name}
          className="w-full h-full object-contain "
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/token-placeholder.png";
          }}
        />
      </div>

      {/* Token Info Section - Dark Purple Background */}
      <div className="px-4 py-4 space-y-3 bg-[#2B1F3B]">
        {/* Token Name & Time */}
        <div className="text-left">
          <h3 className="text-white font-medium text-lg uppercase tracking-wide">
            {token.name}
          </h3>
          <p className="text-gray-400 text-sm uppercase font-medium">
            {token.name}
          </p>
          <p className="text-gray-500 text-xs mt-1">{token.timeAgo}</p>
        </div>

        {/* Market Stats - Two Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column - Market Cap */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">mcap</span>
              <span
                className={`text-xs font-medium ${token.mcapChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
              >
                {formatPercentage(token.mcapChange)}
              </span>
            </div>
            <div className="text-white font-semibold text-sm mt-1">
              {formatNumber(token.mcap)}
            </div>
          </div>

          {/* Right Column - 24h Volume */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">24h</span>
              <span
                className={`text-xs font-medium ${token.volumeChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
              >
                {formatPercentage(token.volumeChange)}
              </span>
            </div>
            <div className="text-white font-semibold text-sm mt-1">
              {formatNumber(token.volume24h)}
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-600"></div>

        {/* Created By */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">by</span>
          <img
            src={token.createdByAvatar}
            alt="Creator"
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/avatar-placeholder.png";
            }}
          />
          <span className="text-white text-sm font-medium">
            {token.createdBy}
          </span>
          {token.verified && <span className="text-blue-400 text-xs">✓</span>}
        </div>
      </div>
    </div>
  );
};

export { TokenCard };
export type { TokenData, TokenCardProps };
