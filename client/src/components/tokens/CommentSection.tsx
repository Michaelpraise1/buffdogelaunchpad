import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { FiSend, FiImage, FiMessageSquare } from "react-icons/fi";

interface Comment {
  _id: string;
  content: string;
  user: {
    username: string;
    profilePicture?: string;
    walletAddress: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  tokenId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ tokenId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${tokenId}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tokenId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setPosting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          tokenId,
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-[#271431] rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
        <h2 className="font-bold uppercase tracking-wider flex items-center gap-2">
          <FiMessageSquare className="text-yellow-400" />
          Cult Discussion
        </h2>
        <span className="text-xs text-gray-400 font-mono">{comments.length} REPLIES</span>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <FiMessageSquare className="text-5xl mx-auto mb-4" />
            <p className="font-bold uppercase tracking-[0.2em] text-sm">Silence is Golden...</p>
            <p className="text-xs mt-2 italic">Be the first to start the cult chatter</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {comment.user.profilePicture ? (
                    <img src={comment.user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-yellow-400 font-bold text-xs">
                      {comment.user.username?.slice(0, 2).toUpperCase() || "BD"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-yellow-400 hover:underline cursor-pointer">
                      {comment.user.username || comment.user.walletAddress.slice(0, 6)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 group-hover:border-white/10 transition-colors">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1a0b25] border-t border-white/5">
        {!user ? (
          <div className="text-center py-4 bg-yellow-400/5 rounded-2xl border border-yellow-400/10">
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Chat Locked 🔒</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase">Connect wallet to join the discussion</p>
          </div>
        ) : (
          <form onSubmit={handlePostComment} className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post a reply..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-yellow-400/50 transition-all resize-none placeholder:text-gray-600"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-white transition-colors"
                title="Add Image (Coming Soon)"
              >
                <FiImage />
              </button>
              <button
                type="submit"
                disabled={posting || !newComment.trim()}
                className={`p-2 rounded-xl transition-all ${posting || !newComment.trim() ? "text-gray-600 cursor-not-allowed" : "text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-lg shadow-yellow-400/10"}`}
              >
                <FiSend />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
