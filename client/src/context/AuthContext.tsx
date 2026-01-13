import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

interface User {
  _id: string;
  walletAddress: string;
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<User, "_id" | "walletAddress">>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected, disconnect, signMessage } = useWallet();

  const login = useCallback(async (walletAddress: string) => {
    if (!signMessage) {
      console.error("Wallet does not support message signing!");
      // Fallback or alert user
      return;
    }

    setLoading(true);
    try {
      const message = `Login to BuffDoge Launchpad\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const response = await fetch("http://localhost:5000/api/auth/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          signature: signatureBase58,
          message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Login error:", error);
      // If user cancels or fails, we might want to disconnect or show error
      disconnect();
    } finally {
      setLoading(false);
    }
  }, [signMessage, disconnect]);

  const updateProfile = useCallback(async (data: Partial<Omit<User, "_id" | "walletAddress">>) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      setUser(updatedData.user);
      localStorage.setItem("user", JSON.stringify(updatedData.user));
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (connected && publicKey && !user && !loading) {
      login(publicKey.toString());
    }
  }, [connected, publicKey, user, login, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
