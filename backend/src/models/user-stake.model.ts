import mongoose, { Schema, Document } from "mongoose";

export interface IUserStake extends Document {
  user: mongoose.Types.ObjectId;
  stakedAmount: number;
  stakedAt: Date;
  claimedSolRewards: number; // Total SOL fees claimed by this user
  tokenAirdrops: {
    token: mongoose.Types.ObjectId;
    symbol: string;
    amount: number;
    receivedAt: Date;
    claimed: boolean;
  }[];
  pendingWithdrawal?: {
    amount: number;
    type: "instant" | "standard";
    requestedAt: Date;
    availableAt?: Date; // For standard withdrawals (5 days from request)
  };
  updatedAt: Date;
}

const UserStakeSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stakedAmount: { type: Number, default: 0 },
    stakedAt: { type: Date },
    claimedSolRewards: { type: Number, default: 0 },
    tokenAirdrops: [
      {
        token: { type: Schema.Types.ObjectId, ref: "Token" },
        symbol: { type: String },
        amount: { type: Number },
        receivedAt: { type: Date },
        claimed: { type: Boolean, default: false },
      },
    ],
    pendingWithdrawal: {
      amount: { type: Number },
      type: { type: String, enum: ["instant", "standard"] },
      requestedAt: { type: Date },
      availableAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserStake>("UserStake", UserStakeSchema);
