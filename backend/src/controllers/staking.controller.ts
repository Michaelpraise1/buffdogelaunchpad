import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import StakingPool from "../models/staking.model";
import UserStake from "../models/user-stake.model";
import Token from "../models/token.model";

const MIN_STAKE_AMOUNT = 1000000; // 1M BUFFDOGE
const INSTANT_WITHDRAWAL_FEE = 0.05; // 5%
const STANDARD_WITHDRAWAL_DAYS = 5;

export const getPoolStats = async (req: AuthRequest, res: Response) => {
  try {
    const pool = await StakingPool.findOne();
    const totalTokensCreated = await Token.countDocuments();
    const totalGraduated = await Token.countDocuments({ isGraduated: true });

    if (!pool) {
      return res.status(200).json({
        fees: 0,
        totalStaked: 0,
        tokenRewardsCount: 0,
        globalStats: {
          totalTokensCreated,
          totalGraduated,
        },
      });
    }

    return res.status(200).json({
      fees: pool.totalSolRewards,
      totalStaked: pool.totalStaked,
      tokenRewardsCount: pool.tokenRewards.length,
      tokenRewards: pool.tokenRewards,
      globalStats: {
        totalTokensCreated,
        totalGraduated,
      },
    });
  } catch (error) {
    console.error("Get pool stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const stakeTokens = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!amount || amount < MIN_STAKE_AMOUNT) {
      return res.status(400).json({
        message: `Minimum stake is ${MIN_STAKE_AMOUNT.toLocaleString()} BUFFDOGE`,
      });
    }

    // Get or create user stake
    let userStake = await UserStake.findOne({ user: userId });
    if (!userStake) {
      userStake = await UserStake.create({
        user: userId,
        stakedAmount: amount,
        stakedAt: new Date(),
      });
    } else {
      userStake.stakedAmount += amount;
      if (!userStake.stakedAt) userStake.stakedAt = new Date();
      await userStake.save();
    }

    // Update global pool
    await StakingPool.findOneAndUpdate(
      {},
      { $inc: { totalStaked: amount } },
      { upsert: true }
    );

    return res.status(200).json({
      message: "Staked successfully",
      stakedAmount: userStake.stakedAmount,
    });
  } catch (error) {
    console.error("Stake error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const withdrawInstant = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    if (!userStake || userStake.stakedAmount < amount) {
      return res.status(400).json({ message: "Insufficient staked balance" });
    }

    // Apply 5% fee
    const fee = amount * INSTANT_WITHDRAWAL_FEE;
    const netAmount = amount - fee;

    userStake.stakedAmount -= amount;
    await userStake.save();

    // Update global pool
    await StakingPool.findOneAndUpdate({}, { $inc: { totalStaked: -amount } });

    return res.status(200).json({
      message: "Instant withdrawal successful",
      withdrawn: netAmount,
      fee: fee,
      remainingStake: userStake.stakedAmount,
    });
  } catch (error) {
    console.error("Instant withdrawal error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const withdrawStandard = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    if (!userStake || userStake.stakedAmount < amount) {
      return res.status(400).json({ message: "Insufficient staked balance" });
    }

    if (userStake.pendingWithdrawal) {
      return res.status(400).json({
        message: "You already have a pending withdrawal. Cancel it first.",
      });
    }

    const requestedAt = new Date();
    const availableAt = new Date(
      requestedAt.getTime() + STANDARD_WITHDRAWAL_DAYS * 24 * 60 * 60 * 1000
    );

    userStake.pendingWithdrawal = {
      amount,
      type: "standard",
      requestedAt,
      availableAt,
    };
    await userStake.save();

    return res.status(200).json({
      message: "Standard withdrawal initiated",
      availableAt,
      amount,
    });
  } catch (error) {
    console.error("Standard withdrawal error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    if (!userStake || !userStake.pendingWithdrawal) {
      return res.status(400).json({ message: "No pending withdrawal" });
    }

    userStake.pendingWithdrawal = undefined;
    await userStake.save();

    return res.status(200).json({ message: "Withdrawal cancelled" });
  } catch (error) {
    console.error("Cancel withdrawal error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const completeWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    if (!userStake || !userStake.pendingWithdrawal) {
      return res.status(400).json({ message: "No pending withdrawal" });
    }

    const { pendingWithdrawal } = userStake;
    if (pendingWithdrawal.type !== "standard") {
      return res.status(400).json({ message: "Invalid withdrawal type" });
    }

    if (
      pendingWithdrawal.availableAt &&
      new Date() < pendingWithdrawal.availableAt
    ) {
      return res.status(400).json({
        message: "Withdrawal not yet available",
        availableAt: pendingWithdrawal.availableAt,
      });
    }

    const amount = pendingWithdrawal.amount;
    userStake.stakedAmount -= amount;
    userStake.pendingWithdrawal = undefined;
    await userStake.save();

    // Update global pool
    await StakingPool.findOneAndUpdate({}, { $inc: { totalStaked: -amount } });

    return res.status(200).json({
      message: "Withdrawal completed",
      withdrawn: amount,
      remainingStake: userStake.stakedAmount,
    });
  } catch (error) {
    console.error("Complete withdrawal error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserStake = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    if (!userStake) {
      return res.status(200).json({
        stakedAmount: 0,
        pendingWithdrawal: null,
      });
    }

    return res.status(200).json({
      stakedAmount: userStake.stakedAmount,
      stakedAt: userStake.stakedAt,
      pendingWithdrawal: userStake.pendingWithdrawal || null,
    });
  } catch (error) {
    console.error("Get user stake error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRewards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId }).populate('tokenAirdrops.token', 'name symbol logo');
    const pool = await StakingPool.findOne();

    if (!userStake || !pool || pool.totalStaked === 0) {
      return res.status(200).json({
        sharePercentage: 0,
        solRewards: 0,
        claimedSolRewards: 0,
        unclaimedSolRewards: 0,
        tokenRewards: [],
        tokenAirdrops: [],
      });
    }

    const sharePercentage = (userStake.stakedAmount / pool.totalStaked) * 100;
    const totalSolRewards = (pool.totalSolRewards * sharePercentage) / 100;
    const claimedSolRewards = userStake.claimedSolRewards || 0;
    const unclaimedSolRewards = Math.max(0, totalSolRewards - claimedSolRewards);

    const tokenRewards = pool.tokenRewards.map((reward) => ({
      symbol: reward.symbol,
      amount: (reward.amount * sharePercentage) / 100,
      token: reward.token,
    }));

    return res.status(200).json({
      sharePercentage,
      solRewards: totalSolRewards,
      claimedSolRewards,
      unclaimedSolRewards,
      tokenRewards,
      tokenAirdrops: userStake.tokenAirdrops || [],
    });
  } catch (error) {
    console.error("Get user rewards error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const claimSolRewards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userStake = await UserStake.findOne({ user: userId });
    const pool = await StakingPool.findOne();

    if (!userStake || !pool || pool.totalStaked === 0) {
      return res.status(400).json({ message: "No staking rewards available" });
    }

    // Calculate unclaimed rewards
    const sharePercentage = (userStake.stakedAmount / pool.totalStaked) * 100;
    const totalSolRewards = (pool.totalSolRewards * sharePercentage) / 100;
    const claimedSolRewards = userStake.claimedSolRewards || 0;
    const unclaimedSolRewards = Math.max(0, totalSolRewards - claimedSolRewards);

    if (unclaimedSolRewards <= 0) {
      return res.status(400).json({ message: "No unclaimed rewards available" });
    }

    // Update claimed amount
    userStake.claimedSolRewards = totalSolRewards;
    await userStake.save();

    return res.status(200).json({
      message: "Rewards claimed successfully",
      claimedAmount: unclaimedSolRewards,
      totalClaimed: userStake.claimedSolRewards,
    });
  } catch (error) {
    console.error("Claim rewards error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
