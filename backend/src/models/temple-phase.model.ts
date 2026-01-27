import mongoose, { Schema, Document } from "mongoose";

export interface ITierReward {
  tier: number;
  mcapThreshold: number;
  maxSpots: number;
  buffdogePercentage: number;
  solPercentage: number;
  spotsUsed: number;
}

export interface ITemplePhase extends Document {
  phaseNumber: number;
  startDate: Date;
  endDate: Date;
  totalBuffdogeRewards: number;
  totalSolRewards: number;
  isActive: boolean;
  tierRewards: ITierReward[];
  createdAt: Date;
  updatedAt: Date;
}

const TierRewardSchema = new Schema({
  tier: { type: Number, required: true },
  mcapThreshold: { type: Number, required: true },
  maxSpots: { type: Number, required: true },
  buffdogePercentage: { type: Number, required: true },
  solPercentage: { type: Number, required: true },
  spotsUsed: { type: Number, default: 0 },
});

const TemplePhaseSchema: Schema = new Schema(
  {
    phaseNumber: { type: Number, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalBuffdogeRewards: { type: Number, required: true },
    totalSolRewards: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    tierRewards: [TierRewardSchema],
  },
  { timestamps: true }
);

// Index for finding active phase
TemplePhaseSchema.index({ isActive: 1 });
TemplePhaseSchema.index({ phaseNumber: -1 });

export default mongoose.model<ITemplePhase>("TemplePhase", TemplePhaseSchema);
