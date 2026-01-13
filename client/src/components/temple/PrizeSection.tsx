import React from "react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  avatar: string;
  mcap: number;
}

interface PrizeTier {
  mcap: string;
  mcapValue: number;
  target: string;
  buffdoge: string;
  sol: string;
  status: "completed" | "next" | "upcoming";
  users?: number;
  tokens?: Token[];
  specialLabel?: string;
}

// Mock token data - replace with actual API data
const ALL_TOKENS: Token[] = [
  {
    id: "1",
    name: "FUMBLE",
    symbol: "FUMBLE",
    avatar: "/images/PINK.png",
    mcap: 45000000,
  },
  {
    id: "2",
    name: "ROADMAP",
    symbol: "ROAP",
    avatar: "/images/YEL.png",
    mcap: 35000000,
  },
  {
    id: "3",
    name: "WUFF",
    symbol: "WUFF",
    avatar: "/images/PINK.png",
    mcap: 25000000,
  },
  {
    id: "4",
    name: "CREO",
    symbol: "CREO",
    avatar: "/images/YEL.png",
    mcap: 22000000,
  },
  {
    id: "5",
    name: "NEUTRAL",
    symbol: "NEUTRAL",
    avatar: "/images/PINK.png",
    mcap: 18000000,
  },
  {
    id: "6",
    name: "POOP",
    symbol: "poop",
    avatar: "/images/YEL.png",
    mcap: 12000000,
  },
  {
    id: "7",
    name: "HOLD",
    symbol: "HOLD",
    avatar: "/images/PINK.png",
    mcap: 8000000,
  },
  {
    id: "8",
    name: "BUFFDOGE",
    symbol: "BUFFDOGE",
    avatar: "/images/YEL.png",
    mcap: 4500000,
  },
  {
    id: "9",
    name: "SDOG",
    symbol: "SDOG",
    avatar: "/images/PINK.png",
    mcap: 3800000,
  },
  {
    id: "10",
    name: "P8",
    symbol: "P8",
    avatar: "/images/YEL.png",
    mcap: 2500000,
  },
  {
    id: "11",
    name: "RED",
    symbol: "RED",
    avatar: "/images/PINK.png",
    mcap: 1800000,
  },
  {
    id: "12",
    name: "BLUE",
    symbol: "BLUE",
    avatar: "/images/YEL.png",
    mcap: 800000,
  },
];

const PrizesSection: React.FC = () => {
  // Function to get tokens in a specific market cap range
  const getTokensInRange = (minMcap: number, maxMcap: number): Token[] => {
    return ALL_TOKENS.filter(
      (token) => token.mcap >= minMcap && token.mcap < maxMcap
    );
  };

  const PRIZE_TIERS: PrizeTier[] = [
    {
      mcap: "50M",
      mcapValue: 50000000,
      target: "2,000,000",
      buffdoge: "BUFFDOGE",
      sol: "300 SOL",
      status: "completed",
      users: 0,
      tokens: getTokensInRange(50000000, Infinity),
    },
    {
      mcap: "30M",
      mcapValue: 30000000,
      target: "1,500,000",
      buffdoge: "BUFFDOGE",
      sol: "225 SOL",
      status: "completed",
      users: 0,
      tokens: getTokensInRange(30000000, 50000000),
    },
    {
      mcap: "20M",
      mcapValue: 20000000,
      target: "1,000,000",
      buffdoge: "BUFFDOGE",
      sol: "150 SOL",
      status: "completed",
      users: 3,
      tokens: getTokensInRange(20000000, 30000000),
    },
    {
      mcap: "15M",
      mcapValue: 15000000,
      target: "625,000",
      buffdoge: "BUFFDOGE",
      sol: "93.75 SOL",
      status: "next",
      users: 5,
      tokens: getTokensInRange(15000000, 20000000),
    },
    {
      mcap: "10M",
      mcapValue: 10000000,
      target: "250,000",
      buffdoge: "BUFFDOGE",
      sol: "37.5 SOL",
      status: "upcoming",
      users: 2,
      tokens: getTokensInRange(10000000, 15000000),
    },
    {
      mcap: "5M",
      mcapValue: 5000000,
      target: "150,000",
      buffdoge: "BUFFDOGE",
      sol: "22.5 SOL",
      status: "upcoming",
      users: 2,
      tokens: getTokensInRange(5000000, 10000000),
      specialLabel: "508 Fill × 76 Hug",
    },
    {
      mcap: "2M",
      mcapValue: 2000000,
      target: "50,000",
      buffdoge: "BUFFDOGE",
      sol: "7.5 SOL",
      status: "upcoming",
      users: 8,
      tokens: getTokensInRange(2000000, 5000000),
    },
    {
      mcap: "1M",
      mcapValue: 1000000,
      target: "25,000",
      buffdoge: "BUFFDOGE",
      sol: "3.75 SOL",
      status: "upcoming",
      users: 12,
      tokens: getTokensInRange(1000000, 2000000),
    },
  ];

  // Component for rendering stacked circles like in your Figma design
  const StackedTokenCircles: React.FC<{
    tokens?: Token[];
    status: string;
    users?: number;
  }> = ({ tokens, status, users }) => {
    // Determine total number of circles to show
    const totalCircles =
      tokens && tokens.length > 0 ? tokens.length : users || 0;

    if (totalCircles === 0) {
      return (
        <div className="flex justify-end">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-xs">0</span>
          </div>
        </div>
      );
    }

    // Calculate spacing - each circle overlaps by about 75%
    const circleSize = 32; // 32px = w-8 h-8
    const overlapOffset = 6; // Distance between circle centers
    const totalWidth =
      circleSize + Math.min(totalCircles - 1, 15) * overlapOffset;

    return (
      <div className="flex justify-end">
        <div
          className="relative"
          style={{ width: `${totalWidth}px`, height: `${circleSize}px` }}
        >
          {/* Render circles with proper stacking */}
          {Array.from({ length: Math.min(totalCircles, 16) }).map(
            (_, index) => {
              const isLast = index === Math.min(totalCircles, 15);
              const showPlus = totalCircles > 16 && isLast;
              const token = tokens && tokens[index];

              return (
                <div
                  key={index}
                  className={`absolute w-8 h-8 rounded-full border-2 overflow-hidden transition-transform hover:scale-110 hover:z-50 ${
                    status === "completed"
                      ? "border-green-500/60"
                      : status === "next"
                      ? "border-yellow-500/60"
                      : "border-gray-600/60"
                  }`}
                  style={{
                    left: `${index * overlapOffset}px`,
                    zIndex: 50 - index, // Higher z-index for earlier circles
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  title={
                    token
                      ? `${token.name} (${token.symbol}) - $${(
                          token.mcap / 1000000
                        ).toFixed(1)}M`
                      : `Token ${index + 1}`
                  }
                >
                  {showPlus ? (
                    // Plus circle for remaining count
                    <div
                      className={`w-full h-full flex items-center justify-center text-xs font-bold ${
                        status === "completed"
                          ? "bg-green-500/80 text-white"
                          : status === "next"
                          ? "bg-yellow-500/80 text-black"
                          : "bg-gray-600/80 text-gray-300"
                      }`}
                    >
                      +{totalCircles - 15}
                    </div>
                  ) : token ? (
                    // Actual token image
                    <img
                      src={token.avatar}
                      alt={token.symbol}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/PINK.png";
                      }}
                    />
                  ) : (
                    // Fallback placeholder circle
                    <div
                      className={`w-full h-full flex items-center justify-center text-xs font-bold ${
                        status === "completed"
                          ? "bg-green-500/80 text-white"
                          : status === "next"
                          ? "bg-yellow-500/80 text-black"
                          : "bg-gray-600/80 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + (index % 26))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#271431] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">
          This Period's Prizes
        </h3>
        <span className="text-gray-400 text-xs">ⓘ</span>
      </div>

      <div className="flex justify-between text-gray-400 text-xs mb-4 px-2">
        <span>Target Mcap</span>
        <span>Winning Cults</span>
      </div>

      <div className="space-y-3">
        {PRIZE_TIERS.map((tier, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-xl border transition-all ${
              tier.status === "next"
                ? "bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/30"
                : tier.status === "completed"
                ? "bg-[#0000003D] border-green-500/30"
                : "bg-[#0000003D] border-purple-600/20"
            }`}
          >
            {tier.status === "next" && (
              <div className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                Next Milestone
              </div>
            )}

            {tier.specialLabel && (
              <div className="absolute -top-2 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">
                {tier.specialLabel}
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-white text-lg font-bold">
                  {tier.mcap} mcap
                </div>
                <div className="text-gray-400 text-xs">
                  <span className="golden-text font-semibold">
                    {tier.target}
                  </span>{" "}
                  {tier.buffdoge} +{" "}
                  <span className="golden-text font-semibold">{tier.sol}</span>{" "}
                  each
                </div>
              </div>

              <StackedTokenCircles
                tokens={tier.tokens}
                status={tier.status}
                users={tier.users}
              />
            </div>

            {/* Special case for 2M and 1M tiers with bottom token display */}
            {(tier.mcapValue === 2000000 || tier.mcapValue === 1000000) && (
              <div className="mt-4 pt-3">
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    {/* Show large circles in a row at bottom like your design */}
                    {tier.mcapValue === 2000000 && (
                      <div className="flex items-center relative">
                        {/* Background stacked circles */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-6 h-6 rounded-full border border-dashed border-gray-600/50"
                            style={{
                              left: `${i * 4}px`,
                              zIndex: 10 - i,
                            }}
                          />
                        ))}
                        {/* Main tokens */}
                        <div className="relative z-20 flex items-center ml-8">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-600">
                            <span className="text-black text-sm font-bold">
                              F
                            </span>
                          </div>
                          <div className="w-8 h-8 bg-yellow-500 rounded-full -ml-2 border-2 border-gray-600"></div>
                        </div>
                      </div>
                    )}

                    {tier.mcapValue === 1000000 && (
                      <div className="flex items-center relative">
                        {/* Background stacked circles */}
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-5 h-5 rounded-full border border-dashed border-gray-600/50"
                            style={{
                              left: `${i * 3}px`,
                              zIndex: 15 - i,
                            }}
                          />
                        ))}
                        {/* Main tokens */}
                        <div className="relative z-20 flex items-center ml-10">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-gray-600"></div>
                          <div className="w-10 h-10 bg-purple-600 rounded-full -ml-2 border-2 border-gray-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              P
                            </span>
                          </div>
                          <div className="w-9 h-9 bg-white rounded-full -ml-2 border-2 border-gray-600 flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              W
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizesSection;
