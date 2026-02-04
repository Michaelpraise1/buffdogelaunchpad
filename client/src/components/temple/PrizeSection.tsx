import React, { useEffect, useState } from "react";
import { getTemplePhase, getAchievements } from "../../services/temple.service";
import type { TemplePhase } from "../../services/temple.service";

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

const PrizesSection: React.FC = () => {
  const [phase, setPhase] = useState<TemplePhase | null>(null);
  const [loading, setLoading] = useState(true);
  const [prizeTiers, setPrizeTiers] = useState<PrizeTier[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Phase
        const phaseRes = await getTemplePhase();
        if (phaseRes.active && phaseRes.phase) {
          setPhase(phaseRes.phase);

          // Fetch Achievements
          const achRes = await getAchievements(phaseRes.phase._id);


          // Map Backend Data to UI Structure
          const tiers: PrizeTier[] = phaseRes.phase.tierRewards.map((tier) => {
            // Find achievements for this tier
            const tierAchievements = achRes.achievements.filter((a) => a.tier === tier.tier);

            // Map winners to tokens
            const winnerTokens: Token[] = tierAchievements.map((a) => ({
              id: a.token._id,
              name: a.token.name,
              symbol: a.token.symbol,
              avatar: a.token.logo,
              mcap: a.token.marketCap,
            }));

            // Determine Status
            let status: "completed" | "next" | "upcoming" = "upcoming";
            if (tier.spotsRemaining === 0) status = "completed";
            // Simple logic: if spots filled < max spots, it's open.

            // Formatting helpers
            const mcapLabel = tier.mcapThreshold >= 1000000
              ? `${tier.mcapThreshold / 1000000}M`
              : `${tier.mcapThreshold / 1000}K`;

            const buffdogeLabel = (phaseRes.phase!.totalBuffdogeRewards * tier.buffdogePercentage / 100).toLocaleString();

            const rewardPerWinnerSol = ((phaseRes.phase!.totalSolRewards * tier.solPercentage / 100) / tier.maxSpots).toFixed(2);

            return {
              mcap: mcapLabel,
              mcapValue: tier.mcapThreshold,
              target: buffdogeLabel,
              buffdoge: "BUFFDOGE",
              sol: `${rewardPerWinnerSol} SOL`,
              status: status,
              users: tierAchievements.length, // Display number of winners
              tokens: winnerTokens, // Display winner avatars
            };
          });

          // Sort by MCAP descending (Tier 8 is highest mcap usually? Check data structure)
          // Actually doc says Tier 1 = $1M, Tier 8 = $50M. So we sort Descending by mcapValue.
          setPrizeTiers(tiers.sort((a, b) => b.mcapValue - a.mcapValue));
        }
      } catch (error) {
        console.error("Failed to load temple data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                  className={`absolute w-8 h-8 rounded-full border-2 overflow-hidden transition-transform hover:scale-110 hover:z-50 ${status === "completed"
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
                      className={`w-full h-full flex items-center justify-center text-xs font-bold ${status === "completed"
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
                      className={`w-full h-full flex items-center justify-center text-xs font-bold ${status === "completed"
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

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading Temple...</div>;
  }

  if (!phase) {
    return <div className="bg-[#271431] rounded-2xl p-6 text-center text-gray-400">Temple is currently closed.</div>;
  }

  return (
    <div className="bg-[#271431] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">
          Phase {phase.phaseNumber} Prizes
        </h3>
        <span className="text-gray-400 text-xs">ⓘ</span>
      </div>

      <div className="flex justify-between text-gray-400 text-xs mb-4 px-2">
        <span>Target Mcap</span>
        <span>Winning Cults</span>
      </div>

      <div className="space-y-3">
        {prizeTiers.map((tier, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-xl border transition-all ${tier.status === "next"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizesSection;
