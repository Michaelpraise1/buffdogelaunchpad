import mongoose, { Schema, Document } from "mongoose";

export interface IStakingPool extends Document {
  totalSolRewards: number; // Total SOL fees collected
  totalStaked: number; // Total BUFFDOGE staked by all users
  tokenRewards: {
    token: mongoose.Types.ObjectId;
    amount: number;
    symbol: string;
  }[];
  updatedAt: Date;
}

const StakingPoolSchema: Schema = new Schema(
  {
    totalSolRewards: { type: Number, default: 0 },
    totalStaked: { type: Number, default: 0 },
    tokenRewards: [
      {
        token: { type: Schema.Types.ObjectId, ref: "Token" },
        amount: { type: Number, required: true },
        symbol: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Singleton pattern helper (optional, strictly one pool implies specific ID or query)
export default mongoose.model<IStakingPool>("StakingPool", StakingPoolSchema);
