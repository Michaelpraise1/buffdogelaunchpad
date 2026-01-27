import mongoose, { Schema, Document } from "mongoose";

export interface IHolderSnapshot {
  user: mongoose.Types.ObjectId;
  amount: number;
  percentage: number;
}

export interface ITempleAchievement extends Document {
  token: mongoose.Types.ObjectId;
  phase: mongoose.Types.ObjectId;
  tier: number;
  mcapThreshold: number;
  timerStartedAt?: Date;
  achievedAt?: Date;
  holderSnapshot: IHolderSnapshot[];
  rewardsDistributed: boolean;
  spotNumber: number;
  buffdogeReward: number;
  solReward: number;
  createdAt: Date;
  updatedAt: Date;
}

const HolderSnapshotSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
});

const TempleAchievementSchema: Schema = new Schema(
  {
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true },
    phase: { type: Schema.Types.ObjectId, ref: "TemplePhase", required: true },
    tier: { type: Number, required: true },
    mcapThreshold: { type: Number, required: true },
    timerStartedAt: { type: Date },
    achievedAt: { type: Date },
    holderSnapshot: [HolderSnapshotSchema],
    rewardsDistributed: { type: Boolean, default: false },
    spotNumber: { type: Number, required: true },
    buffdogeReward: { type: Number, default: 0 },
    solReward: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for efficient queries
TempleAchievementSchema.index({ token: 1, phase: 1 });
TempleAchievementSchema.index({ phase: 1, tier: 1 });
TempleAchievementSchema.index({ achievedAt: 1 });

export default mongoose.model<ITempleAchievement>(
  "TempleAchievement",
  TempleAchievementSchema
);
