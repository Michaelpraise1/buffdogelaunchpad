import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import Token from "../models/token.model";
import Trade from "../models/trade.model";
import Balance from "../models/balance.model";

const INITIAL_VIRTUAL_SOL = 30;
const INITIAL_VIRTUAL_TOKENS = 1000000000; // 1B
const GRADUATION_SOL_TARGET = 86;

export const createToken = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, symbol, description, logo,
      twitter, discord, website, github, instagram, tiktok,
      initialBuyAmount, // SOL amount to buy
      antiRugLimit // % of supply (e.g. 1, 2, 5)
    } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !symbol || !description || !logo) {
      return res.status(400).json({ message: "Name, symbol, description, and logo are required" });
    }

    // Calculate initial state based on pre-buy
    let virtualSolReserves = INITIAL_VIRTUAL_SOL;
    let virtualTokenReserves = INITIAL_VIRTUAL_TOKENS;
    let bondingCurveProgress = 0;
    let marketCap = 0;
    let tokensBought = 0;

    if (initialBuyAmount && initialBuyAmount > 0) {
      const currentX = virtualSolReserves;
      const currentY = virtualTokenReserves;
      const k = currentX * currentY;

      const nextX = currentX + Number(initialBuyAmount);
      const nextY = k / nextX;
      tokensBought = currentY - nextY;

      virtualSolReserves = nextX;
      virtualTokenReserves = nextY;

      const addedSol = virtualSolReserves - INITIAL_VIRTUAL_SOL;
      bondingCurveProgress = Math.min((addedSol / GRADUATION_SOL_TARGET) * 100, 100);
      marketCap = virtualSolReserves * 200; // Mock price
    }

    // Calculate Max Wallet Limit
    let maxWalletLimit;
    if (antiRugLimit) {
      // e.g. 1% of 1B = 10,000,000
      maxWalletLimit = (INITIAL_VIRTUAL_TOKENS * antiRugLimit) / 100;
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
      tiktok,
      virtualSolReserves,
      virtualTokenReserves,
      bondingCurveProgress,
      marketCap,
      maxWalletLimit,
      creatorBuyAmount: initialBuyAmount || 0
    });

    // If pre-buy, create trade record and update balance
    if (tokensBought > 0) {
      await Trade.create({
        token: token._id,
        user: userId,
        type: "buy",
        solAmount: initialBuyAmount,
        tokenAmount: tokensBought,
        priceAtTrade: initialBuyAmount / tokensBought
      });

      await Balance.findOneAndUpdate(
        { user: userId, token: token._id },
        { $inc: { amount: tokensBought } },
        { upsert: true, new: true }
      );
    }

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
