import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import bs58 from "bs58";
import User from "../models/user.model";
import { AuthRequest } from "../config/auth.middleware";

const ADJECTIVES = ["Brave", "Swift", "Mighty", "Wild", "Cool", "Epic", "Golden", "Buff", "Doge", "Crypto"];
const NOUNS = ["Warrior", "Trader", "HODLer", "Whale", "Ninja", "Doge", "Buff", "Mooner", "Alpha", "King"];

const generateRandomName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return {
    name: `${adj} ${noun}`,
    username: `${adj.toLowerCase()}_${noun.toLowerCase()}_${num}`,
  };
};

export const loginOrRegister = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ message: "Wallet address, signature, and message are required" });
    }

    // Verify signature
    try {
      const signatureUint8 = bs58.decode(signature);
      const messageUint8 = new TextEncoder().encode(message);
      const pubKeyUint8 = bs58.decode(walletAddress);

      const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, pubKeyUint8);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid signature" });
      }
    } catch (e) {
      return res.status(400).json({ message: "Error decoding signature or wallet address" });
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      const { name, username } = generateRandomName();
      user = await User.create({
        walletAddress,
        name,
        username,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { walletAddress: user.walletAddress, userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, username, bio, profilePicture } = req.body;
    const walletAddress = req.user?.walletAddress;

    if (!walletAddress) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, walletAddress: { $ne: walletAddress } });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { walletAddress },
      {
        $set: {
          ...(name && { name }),
          ...(username && { username }),
          ...(bio !== undefined && { bio }),
          ...(profilePicture !== undefined && { profilePicture }),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
