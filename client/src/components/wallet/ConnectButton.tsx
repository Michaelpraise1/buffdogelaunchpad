import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "../../context/AuthContext";

import ProfileModal from "../profile/ProfileModal";

interface ConnectButtonProps {
  variant?: "desktop" | "mobile";
  className?: string;
  onConnect?: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  variant = "desktop",
  className = "",
  onConnect,
}) => {
  const { publicKey, connected, connecting } = useWallet();
  const { user, logout, loading } = useAuth();
  const { setVisible } = useWalletModal();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Update connecting state based on wallet adapter
  useEffect(() => {
    setIsConnecting(connecting || loading);
  }, [connecting, loading]);

  // Handle connection state changes
  useEffect(() => {
    if (connected && publicKey && user) {
      setIsConnecting(false);
    }
  }, [connected, publicKey, user]);

  const handleConnect = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      setVisible(true); // Open wallet modal
      onConnect?.(); // Call the onConnect callback
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  const handleClick = () => {
    if (connected && publicKey && user) {
      setIsProfileOpen(true);
    } else {
      handleConnect();
    }
  };

  const getButtonText = () => {
    if (isConnecting || connecting || loading) return "Connecting...";
    if (connected && publicKey && user) {
      // Show truncated wallet address or username
      return `🟢 ${user.username}`;
    }
    return "Connect";
  };

  const getButtonClasses = () => {
    const baseClasses =
      "font-semibold transition-all duration-200 focus:outline-none ";

    if (variant === "mobile") {
      return `${baseClasses} w-full py-2.5 border border-white rounded-full text-white text-sm hover:bg-white/10 ${className}`;
    }

    return `${baseClasses} px-4 lg:px-6 py-2 border border-white rounded-full text-white hover:bg-white/10 ${className}`;
  };

  const getButtonStyles = () => {
    if (connected && publicKey) {
      return "border-green-400 text-green-400 hover:bg-green-400/10";
    }
    if (isConnecting || connecting) {
      return "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10";
    }
    return "";
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={isConnecting || connecting}
          className={`${getButtonClasses()} ${getButtonStyles()} ${isConnecting || connecting
            ? "cursor-not-allowed opacity-75"
            : "cursor-pointer"
            }`}
        >
          {getButtonText()}
        </button>

        {connected && publicKey && (
          <button
            onClick={handleDisconnect}
            className="text-white/40 hover:text-white/80 transition-colors text-xs font-medium cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default ConnectButton;
