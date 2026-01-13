import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import Balance from "../models/balance.model";
import Token from "../models/token.model";

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const portfolio = await Balance.find({ user: userId, amount: { $gt: 0 } })
      .populate("token")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error("Get portfolio error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBalanceByToken = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const balance = await Balance.findOne({ user: userId, token: tokenId });

    return res.status(200).json({ balance: balance ? balance.amount : 0 });
  } catch (error) {
    console.error("Get balance error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
