import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { IoClose } from "react-icons/io5";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "holdings">("edit");
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
      });
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setPortfolioLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/portfolio`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error("Fetch portfolio error:", error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const result = await updateProfile(formData);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError("Failed to update profile. Username might be taken.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex border-b border-white/5 mb-6">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 py-3 font-bold transition-all ${activeTab === "edit" ? "text-green-400 border-b-2 border-green-400" : "text-white/40 hover:text-white"}`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("holdings")}
              className={`flex-1 py-3 font-bold transition-all ${activeTab === "holdings" ? "text-green-400 border-b-2 border-green-400" : "text-white/40 hover:text-white"}`}
            >
              Holdings
            </button>
          </div>

          {activeTab === "edit" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">Profile updated successfully!</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-black transition-all duration-200 ${loading
                  ? "bg-green-400/50 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                  }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {portfolioLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-10 text-white/40">
                  <p>You don't own any tokens yet.</p>
                </div>
              ) : (
                portfolio.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={item.token.logo} alt={item.token.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-white font-bold text-sm uppercase">{item.token.symbol}</div>
                        <div className="text-white/40 text-xs">{item.token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono font-bold">{(item.amount / 1000000).toLocaleString()} M</div>
                      <div className="text-green-400 text-[10px] font-bold uppercase tracking-wider">Holding</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
