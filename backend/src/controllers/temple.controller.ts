import { Request, Response } from "express";
import TemplePhase from "../models/temple-phase.model";
import TempleAchievement from "../models/temple-achievement.model";
import { templeService } from "../services/temple.service";

/**
 * Get current active phase details including tier status
 */
export const getCurrentPhase = async (req: Request, res: Response) => {
  try {
    const phase = await templeService.getActivePhase();

    if (!phase) {
      return res.status(200).json({
        active: false,
        message: "No active Temple of Moon phase"
      });
    }

    // Get current winners count for each tier to display "spots left"
    const tiersWithStatus = await Promise.all(phase.tierRewards.map(async (tier) => {
      const winners = await TempleAchievement.countDocuments({
        phase: phase._id,
        tier: tier.tier,
        achievedAt: { $exists: true }
      });
      return {
        ...tier.toObject(),
        spotsFilled: winners,
        spotsRemaining: tier.maxSpots - winners
      };
    }));

    return res.status(200).json({
      active: true,
      phase: {
        ...phase.toObject(),
        tierRewards: tiersWithStatus
      }
    });

  } catch (error) {
    console.error("Get current phase error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get achievements (winners and active timers)
 */
export const getAchievements = async (req: Request, res: Response) => {
  try {
    const { phaseId } = req.query;
    let query: any = {};

    if (phaseId) {
      query.phase = phaseId;
    } else {
      // Default to active phase
      const activeTerm = await templeService.getActivePhase();
      if (activeTerm) {
        query.phase = activeTerm._id;
      }
    }

    const achievements = await TempleAchievement.find(query)
      .populate("token", "name symbol logo marketCap")
      .sort({ tier: 1, achievedAt: 1 });

    return res.status(200).json({ achievements });
  } catch (error) {
    console.error("Get achievements error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
