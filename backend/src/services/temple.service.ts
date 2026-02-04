import mongoose from "mongoose";
import TemplePhase, { ITemplePhase, ITierReward } from "../models/temple-phase.model";
import TempleAchievement, { ITempleAchievement, IHolderSnapshot } from "../models/temple-achievement.model";
import Token, { IToken } from "../models/token.model";
import Balance from "../models/balance.model";

export class TempleService {
  /**
   * Checks if a phase is active. If not, creates one if conditions met (simplified for now).
   */
  async getActivePhase(): Promise<ITemplePhase | null> {
    const now = new Date();
    // Find active phase
    let activePhase = await TemplePhase.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    // If no active phase, check if we should start one or return null
    // For MVP, we might assume phases are created manually or by cron. 
    // If we want auto-creation, we can add logic here.
    // For now, let's return null if none active.

    return activePhase;
  }

  /**
   * Called whenever a token is bought.
   * Checks if the token's market cap qualifies it for any tier in the active phase.
   */
  async checkTokenForAchievement(token: IToken): Promise<void> {
    const phase = await this.getActivePhase();
    if (!phase) return; // No active temple phase

    // Checking tiers (highest first? or all?)
    // A token can theoretically win multiple tiers if it climbs fast.
    // We iterate through all tiers.

    for (const tier of phase.tierRewards) {
      // 1. Check if token meets mcap threshold
      if (token.marketCap >= tier.mcapThreshold) {
        // 2. Check if already achieved
        const existingAchievement = await TempleAchievement.findOne({
          token: token._id,
          phase: phase._id,
          tier: tier.tier,
          rewardsDistributed: true // Or just if achievedAt is set?
        });

        if (existingAchievement && existingAchievement.achievedAt) {
          continue; // Already won this tier
        }

        // 3. Check if spots available
        const winnersCount = await TempleAchievement.countDocuments({
          phase: phase._id,
          tier: tier.tier,
          achievedAt: { $exists: true }
        });

        if (winnersCount >= tier.maxSpots) {
          continue; // No spots left
        }

        // 4. Check if timer is already running
        let achievement = await TempleAchievement.findOne({
          token: token._id,
          phase: phase._id,
          tier: tier.tier
        });

        if (!achievement) {
          // Determine spot number (claim the next potential spot)
          // Note: This is an optimistic claim. Two tokens could start timer for 1 spot. 
          // First to finish wins.

          achievement = await TempleAchievement.create({
            token: token._id,
            phase: phase._id,
            tier: tier.tier,
            mcapThreshold: tier.mcapThreshold,
            spotNumber: winnersCount + 1, // Logic might need refinement for race conditions
            timerStartedAt: new Date(),
            buffdogeReward: (phase.totalBuffdogeRewards * tier.buffdogePercentage) / 100,
            solReward: (phase.totalSolRewards * tier.solPercentage) / 100
          });
          console.log(`[Temple] Timer started for ${token.name} on Tier ${tier.tier}`);
        } else if (!achievement.timerStartedAt && !achievement.achievedAt) {
          // Resume timer if it was reset?
          achievement.timerStartedAt = new Date();
          await achievement.save();
          console.log(`[Temple] Timer restarted for ${token.name} on Tier ${tier.tier}`);
        } else {
          // Timer already running. Check if 30 mins passed?
          // We can do an immediate check here too.
          await this.verifyAndAward(achievement, token, tier);
        }
      } else {
        // Token dipped below threshold. Reset timer if running.
        const runningAchievement = await TempleAchievement.findOne({
          token: token._id,
          phase: phase._id,
          tier: tier.tier,
          achievedAt: { $exists: false },
          timerStartedAt: { $exists: true }
        });

        if (runningAchievement) {
          console.log(`[Temple] Resetting timer for ${token.name} on Tier ${tier.tier} (Mcap dropped)`);
          runningAchievement.timerStartedAt = undefined;
          await runningAchievement.save();
        }
      }
    }
  }

  /**
   * Verifies if the 30-minute hold is complete and awards the spot if so.
   */
  async verifyAndAward(achievement: ITempleAchievement, token: IToken, tier: ITierReward): Promise<void> {
    if (!achievement.timerStartedAt) return;

    const now = new Date();
    const timeDiff = now.getTime() - achievement.timerStartedAt.getTime();
    const minutesPassed = timeDiff / (1000 * 60);

    if (minutesPassed >= 30) {
      // Double check spots again to prevent race condition over-awarding
      const phase = await TemplePhase.findById(achievement.phase);
      if (!phase) return;

      const tierInfo = phase.tierRewards.find(t => t.tier === achievement.tier);
      if (!tierInfo) return;

      const currentWinners = await TempleAchievement.countDocuments({
        phase: phase._id,
        tier: tier.tier,
        achievedAt: { $exists: true }
      });

      if (currentWinners >= tierInfo.maxSpots) {
        console.log(`[Temple] Too late! Spots filled for Tier ${tier.tier}`);
        achievement.timerStartedAt = undefined; // Cancel timer
        await achievement.save();
        return;
      }

      // Verify Mcap one last time
      if (token.marketCap < tier.mcapThreshold) {
        console.log(`[Temple] Mcap too low at finish line for ${token.name}`);
        achievement.timerStartedAt = undefined;
        await achievement.save();
        return;
      }

      // SUCCESS! Take Snapshot
      console.log(`[Temple] ${token.name} achieved Tier ${tier.tier}! Taking snapshot...`);

      const balances = await Balance.find({ token: token._id, amount: { $gt: 0 } });
      const totalSupply = token.virtualTokenReserves; // Use current reserves or total supply?
      // Usually total supply distributed. 
      // Assuming 1B total.

      const snapshot: IHolderSnapshot[] = balances.map(b => ({
        user: b.user,
        amount: b.amount,
        percentage: (b.amount / 1000000000) * 100 // Hardcoded 1B supply for now
      }));

      achievement.achievedAt = now;
      achievement.holderSnapshot = snapshot;
      achievement.spotNumber = currentWinners + 1;
      await achievement.save();

      // Update phase spots used?
      // Actually `tierRewards` holds static config, but we can update tracking fields if we added them to schema.
      // Schema has `spotsUsed`!
      await TemplePhase.updateOne(
        { _id: phase._id, "tierRewards.tier": tier.tier },
        { $inc: { "tierRewards.$.spotsUsed": 1 } }
      );
    }
  }

  /**
   * Cron-like job to check all active timers.
   * Can be called periodically or on trades.
   */
  async checkAllTimers(): Promise<void> {
    const activeAchievements = await TempleAchievement.find({
      achievedAt: { $exists: false },
      timerStartedAt: { $exists: true }
    }).populate('token');

    for (const ach of activeAchievements) {
      if (!ach.token) continue;

      const phase = await TemplePhase.findById(ach.phase);
      if (!phase) continue;
      const tier = phase.tierRewards.find(t => t.tier === ach.tier);
      if (!tier) continue;

      await this.verifyAndAward(ach, ach.token as unknown as IToken, tier);
    }
  }
}

export const templeService = new TempleService();
