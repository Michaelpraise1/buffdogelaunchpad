import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import Token from "../models/token.model";

export const createToken = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, symbol, description, logo,
      twitter, discord, website, github, instagram, tiktok
    } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !symbol || !description || !logo) {
      return res.status(400).json({ message: "Name, symbol, description, and logo are required" });
    }

    const token = await Token.create({
      name,
      symbol,
      description,
      logo,
      creator: userId,
      twitter,
      discord,
      website,
      github,
      instagram,
      tiktok
    });

    return res.status(201).json({ token });
  } catch (error) {
    console.error("Create token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTokens = async (req: AuthRequest, res: Response) => {
  try {
    const tokens = await Token.find()
      .populate("creator", "username walletAddress profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json({ tokens });
  } catch (error) {
    console.error("Get all tokens error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTokenById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const token = await Token.findById(id).populate("creator", "username walletAddress profilePicture");

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Get token by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
