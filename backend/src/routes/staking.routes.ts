import express from "express";
import {
  getPoolStats,
  stakeTokens,
  withdrawInstant,
  withdrawStandard,
  cancelWithdrawal,
  completeWithdrawal,
  getUserStake,
  getUserRewards,
  claimSolRewards,
} from "../controllers/staking.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = express.Router();

// Public routes
router.get("/stats", getPoolStats);

// Protected routes
router.post("/stake", authMiddleware, stakeTokens);
router.post("/withdraw/instant", authMiddleware, withdrawInstant);
router.post("/withdraw/standard", authMiddleware, withdrawStandard);
router.post("/withdraw/cancel", authMiddleware, cancelWithdrawal);
router.post("/withdraw/complete", authMiddleware, completeWithdrawal);
router.get("/user", authMiddleware, getUserStake);
router.get("/rewards", authMiddleware, getUserRewards);
router.post("/claim", authMiddleware, claimSolRewards);

export default router;
