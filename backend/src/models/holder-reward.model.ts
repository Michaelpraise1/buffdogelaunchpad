import mongoose, { Schema, Document } from "mongoose";

export interface IHolderReward extends Document {
  token: mongoose.Types.ObjectId;
  totalHolderRewards: number; // Total SOL rewards accumulated for holders of this token
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HolderRewardSchema: Schema = new Schema(
  {
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true, unique: true },
    totalHolderRewards: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IHolderReward>("HolderReward", HolderRewardSchema);
