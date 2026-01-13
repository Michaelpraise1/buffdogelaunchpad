import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiCalendar,
  FiBarChart,
} from "react-icons/fi";
import { TokenCard } from "../components/cards/TokenCard";

const formatTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "yr ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

// Types
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
  progress: number;
  borderColor: "yellow" | "pink" | "orange" | "purple";
}

const FILTER_OPTIONS = [
  { id: "trending", label: "trending", icon: FiTrendingUp },
  { id: "newly-launched", label: "newly launched", icon: FiClock },
  { id: "about-to-graduate", label: "about to graduate", icon: FiActivity },
  { id: "highest-market-cap", label: "highest market cap", icon: FiBarChart },
  { id: "top-gainers", label: "top gainers", icon: FiTrendingUp },
  { id: "oldest", label: "oldest", icon: FiCalendar },
];

// Main Tokens Page Component
const TokensPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("trending");
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/tokens`);
      if (!response.ok) throw new Error("Failed to fetch tokens");
      const data = await response.json();

      const transformedTokens: TokenData[] = data.tokens.map((t: any, index: number) => ({
        id: t._id,
        name: t.name,
        symbol: t.symbol,
        timeAgo: formatTimeAgo(t.createdAt),
        image: t.logo,
        mcap: t.marketCap || 0,
        mcapChange: 0,
        volume24h: 0,
        volumeChange: 0,
        price: 0,
        createdBy: t.creator?.username || t.creator?.walletAddress?.slice(0, 6) + "...",
        createdByAvatar: t.creator?.profilePicture || "/images/avatar-placeholder.png",
        verified: false,
        progress: t.bondingCurveProgress || 0,
        borderColor: ["yellow", "pink", "orange", "purple"][index % 4] as any,
      }));

      setTokens(transformedTokens);
    } catch (err: any) {
      console.error("Fetch tokens error:", err);
      setError("Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const getFilteredTokens = () => {
    switch (activeFilter) {
      case "newly-launched":
        return [...tokens].sort((a, b) => b.id.localeCompare(a.id));
      case "highest-market-cap":
        return [...tokens].sort((a, b) => b.mcap - a.mcap);
      default:
        return tokens;
    }
  };

  const filteredTokens = getFilteredTokens();

  const handleTokenClick = (token: TokenData) => {
    console.log("Token clicked:", token);
  };

  return (
    <div className="w-full min-h-screen p-4 lg:p-6">
      {/* Filters */}
      <div className="w-full py-4 px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {FILTER_OPTIONS.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border
                  ${isActive
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white"
                  }
                `}
              >
                <IconComponent
                  size={16}
                  className={`${isActive ? "text-black" : "text-current"}`}
                />
                <span className="whitespace-nowrap">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Token Cards Grid */}
      <div className="w-full px-4 lg:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">Summoning the cults...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={fetchTokens}
              className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredTokens.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onClick={handleTokenClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && !error && filteredTokens.length === 0 && (
        <div className="w-full flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              No tokens found for this filter
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try selecting a different filter option
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensPage;
