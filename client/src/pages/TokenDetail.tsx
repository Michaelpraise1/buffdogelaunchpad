import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Header } from "../components/navigation/Header";
import { FiArrowLeft, FiTwitter, FiGlobe } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { PriceChart } from "../components/tokens/PriceChart";
import { CommentSection } from "../components/tokens/CommentSection";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface Token {
  _id: string;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  marketCap: number;
  bondingCurveProgress: number;
  creator: {
    username: string;
    walletAddress: string;
    profilePicture?: string;
  };
  twitter?: string;
  discord?: string;
  website?: string;
  createdAt: string;
}

const TokenDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  const [trades, setTrades] = useState<any[]>([]);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const fetchToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tokens/${id}`);
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trades/history/${id}`);
      const data = await response.json();
      setTrades(data.trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const jwtToken = localStorage.getItem("token");
      if (!jwtToken) return;

      const response = await fetch(`${API_BASE_URL}/api/users/balance/${id}`, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      const data = await response.json();
      setUserBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchSolBalance = async () => {
    if (!publicKey) return;
    try {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
    }
  };

  useEffect(() => {
    fetchToken();
    fetchTradeHistory();
    fetchUserBalance();
    fetchSolBalance();
  }, [id, publicKey]);

  const handleTrade = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;

    setTradeLoading(true);
    try {
      const jwtToken = localStorage.getItem("token");
      const endpoint = tradeType === "buy" ? "buy" : "sell";
      const body = tradeType === "buy"
        ? { tokenId: id, solAmount: parseFloat(amount) }
        : { tokenId: id, tokenAmount: parseFloat(amount) * 1000000 };

      const response = await fetch(`${API_BASE_URL}/api/trades/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Trade failed");
      }

      setAmount("");
      fetchToken();
      fetchTradeHistory();
      fetchUserBalance();
      fetchSolBalance();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen home-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen home-bg flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Token not found</h1>
        <Link to="/" className="text-yellow-400 hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen home-bg text-white pb-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 pt-32">
        {/* Back Button */}
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Terminal</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Chart & Info) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Header Info */}
            <div className="bg-[#271431] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6">
              <img
                src={token.logo}
                alt={token.name}
                className="w-32 h-32 rounded-2xl object-cover shadow-2xl border border-white/10"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold uppercase tracking-tight">{token.name}</h1>
                    <span className="bg-yellow-400/10 text-yellow-400 text-xs px-2 py-1 rounded-md font-bold border border-yellow-400/20">
                      ${token.symbol}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Created by {token.creator.username || token.creator.walletAddress.slice(0, 6)}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {token.twitter && (
                    <a href={token.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors">
                      <FiTwitter /> Twitter
                    </a>
                  )}
                  {token.discord && (
                    <a href={token.discord} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                      <FaDiscord /> Discord
                    </a>
                  )}
                  {token.website && (
                    <a href={token.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors">
                      <FiGlobe /> Website
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Market Cap</div>
                <div className="text-3xl font-mono font-bold text-yellow-400">${token.marketCap.toLocaleString()}</div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-[#1a0b25] rounded-3xl border border-white/5 h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none z-10"></div>
              {trades.length > 0 ? (
                <PriceChart trades={trades} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <FiArrowLeft className="mx-auto text-4xl text-white/20 rotate-90" />
                    <p className="text-white/20 font-bold uppercase tracking-widest">Awaiting First Trade...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description Area */}
            <div className="bg-[#271431] p-8 rounded-3xl border border-white/5">
              <h2 className="text-xl font-bold mb-4 uppercase text-yellow-400 tracking-wider">About Cult</h2>
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{token.description}</p>
            </div>

            {/* Recent Trades Table */}
            <div className="bg-[#271431] p-6 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider px-2 border-l-4 border-yellow-400 pl-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-500 text-[10px] uppercase font-bold border-b border-white/5">
                    <tr>
                      <th className="pb-4 px-2">Account</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">SOL</th>
                      <th className="pb-4">Tokens</th>
                      <th className="pb-4">Time</th>
                      <th className="pb-4">TX</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono">
                    {trades.map((t) => (
                      <tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-2 text-blue-400/80 font-bold">
                          <span className="cursor-pointer hover:underline">
                            {t.user?.username || t.user?.walletAddress?.slice(0, 6) + "..."}
                          </span>
                        </td>
                        <td className={t.type === "sell" ? "text-red-500" : "text-green-500"}>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === "sell" ? "bg-red-500/10" : "bg-green-500/10"}`}>
                            {t.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-gray-300">{t.solAmount.toFixed(3)}</td>
                        <td className="text-gray-300">{(t.tokenAmount / 1000000).toFixed(1)}M</td>
                        <td className="text-gray-500 text-xs">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="text-gray-600 group-hover:text-yellow-400 transition-colors cursor-pointer text-xs">
                          🔗
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar (Trading) */}
          <div className="space-y-6">
            {/* Trade Card */}
            <div className="bg-[#271431] p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-purple-500"></div>

              {/* Buy/Sell Tabs */}
              <div className="flex mb-6 bg-[#1a0b25] p-1 rounded-xl">
                <button
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${tradeType === "buy" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-gray-500 hover:text-white"}`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${tradeType === "sell" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-gray-500 hover:text-white"}`}
                >
                  SELL
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1 px-1">
                    <span>{tradeType === "buy" ? "Pay with SOL" : "Sell Tokens"}</span>
                    <span>
                      Balance: {tradeType === "buy" ? `${solBalance.toFixed(3)} SOL` : `${(userBalance / 1000000).toLocaleString()} M`}
                    </span>
                  </div>
                  <div className="relative group">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-[#1a0b25] border border-white/10 p-5 rounded-2xl text-2xl font-mono focus:outline-none focus:border-yellow-400/50 transition-colors"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-500 uppercase">
                      {tradeType === "buy" ? "SOL" : token.symbol}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {["0.1", "0.5", "1", "MAX"].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        if (val === "MAX") {
                          if (tradeType === "sell") {
                            setAmount((userBalance / 1000000).toString());
                          } else {
                            // MAX for buy: leave a bit for gas
                            const maxBuy = Math.max(0, solBalance - 0.05);
                            setAmount(maxBuy.toFixed(3));
                          }
                        } else {
                          setAmount(val);
                        }
                      }}
                      className="bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold transition-colors border border-white/5 uppercase"
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleTrade}
                  disabled={tradeLoading}
                  className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 mt-4 flex items-center justify-center gap-3 ${tradeLoading ? "opacity-50 cursor-not-allowed" :
                    tradeType === "buy" ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                    }`}
                >
                  {tradeLoading && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {tradeType.toUpperCase()}
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-3 italic">
              Note: A 0.2% Ecosystem Fee applies to all trades.
            </p>
          </div>

          {/* Bonding Curve Info */}
          <div className="bg-[#271431] p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold uppercase tracking-wider">Bonding Curve</h3>
              <span className="text-yellow-400 font-mono font-bold">{token.bondingCurveProgress}%</span>
            </div>
            <div className="w-full h-4 bg-[#1a0b25] rounded-full p-1 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000"
                style={{ width: `${token.bondingCurveProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
              When market cap reaches <strong>$69,000</strong>, all liquidity will be deposited to Raydium and burned.
            </p>
          </div>

          {/* Thread/Chat Section */}
          <CommentSection tokenId={id!} />
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
