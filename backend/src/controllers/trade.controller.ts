import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import Token from "../models/token.model";
import Trade from "../models/trade.model";
import Balance from "../models/balance.model";

const INITIAL_VIRTUAL_SOL = 30;
const INITIAL_VIRTUAL_TOKENS = 1000000000; // 1B
const GRADUATION_SOL_TARGET = 85; // Amount of SOL needed to graduate

export const buyToken = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId, solAmount } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!solAmount || solAmount <= 0) return res.status(400).json({ message: "Invalid SOL amount" });

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ message: "Token not found" });

    if (token.isGraduated) {
      return res.status(400).json({ message: "Token has already graduated and trading is moved to DEX" });
    }

    // Calculate tokens to receive using Constant Product Formula (X * Y = K)
    const currentX = token.virtualSolReserves;
    const currentY = token.virtualTokenReserves;
    const k = currentX * currentY;

    const nextX = currentX + solAmount;
    const nextY = k / nextX;
    const tokensToReceive = currentY - nextY;

    // Update Token State
    token.virtualSolReserves = nextX;
    token.virtualTokenReserves = nextY;

    // Calculate Progress
    const addedSol = token.virtualSolReserves - INITIAL_VIRTUAL_SOL;
    token.bondingCurveProgress = Math.min((addedSol / GRADUATION_SOL_TARGET) * 100, 100);

    // Graduation Check
    if (token.bondingCurveProgress >= 100) {
      token.isGraduated = true;
      // In a real app, this would trigger liquidity migration to Raydium
    }

    // Update Market Cap (Dummy calc for now: 1 SOL = $200)
    // In a real app, this would use a price oracle
    const SOL_PRICE_USD = 200;
    token.marketCap = token.virtualSolReserves * SOL_PRICE_USD;

    await token.save();

    // Create Trade Record
    const trade = await Trade.create({
      token: tokenId,
      user: userId,
      type: "buy",
      solAmount,
      tokenAmount: tokensToReceive,
      priceAtTrade: solAmount / tokensToReceive
    });

    // Update User Balance
    await Balance.findOneAndUpdate(
      { user: userId, token: tokenId },
      { $inc: { amount: tokensToReceive } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Purchase successful",
      trade,
      tokenState: {
        progress: token.bondingCurveProgress,
        marketCap: token.marketCap
      }
    });
  } catch (error) {
    console.error("Buy error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sellToken = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId, tokenAmount } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!tokenAmount || tokenAmount <= 0) return res.status(400).json({ message: "Invalid token amount" });

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ message: "Token not found" });

    if (token.isGraduated) {
      return res.status(400).json({ message: "Token has already graduated and trading is moved to DEX" });
    }

    // Check User Balance
    const balance = await Balance.findOne({ user: userId, token: tokenId });
    if (!balance || balance.amount < tokenAmount) {
      return res.status(400).json({ message: "Insufficient token balance" });
    }

    // Calculate SOL to receive
    const currentX = token.virtualSolReserves;
    const currentY = token.virtualTokenReserves;
    const k = currentX * currentY;

    const nextY = currentY + tokenAmount;
    const nextX = k / nextY;
    const solToReceive = currentX - nextX;

    if (solToReceive <= 0) return res.status(400).json({ message: "Token amount too small" });

    // Update Token State
    token.virtualSolReserves = nextX;
    token.virtualTokenReserves = nextY;

    // Calculate Progress
    const addedSol = token.virtualSolReserves - INITIAL_VIRTUAL_SOL;
    token.bondingCurveProgress = Math.max((addedSol / GRADUATION_SOL_TARGET) * 100, 0);

    const SOL_PRICE_USD = 200;
    token.marketCap = token.virtualSolReserves * SOL_PRICE_USD;

    await token.save();

    // Create Trade Record
    const trade = await Trade.create({
      token: tokenId,
      user: userId,
      type: "sell",
      solAmount: solToReceive,
      tokenAmount,
      priceAtTrade: solToReceive / tokenAmount
    });

    // Update User Balance
    balance.amount -= tokenAmount;
    await balance.save();

    return res.status(200).json({
      message: "Sale successful",
      trade,
      tokenState: {
        progress: token.bondingCurveProgress,
        marketCap: token.marketCap
      }
    });
  } catch (error) {
    console.error("Sell error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTradeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId } = req.params;
    const trades = await Trade.find({ token: tokenId })
      .populate("user", "username walletAddress")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ trades });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching trades" });
  }
};
