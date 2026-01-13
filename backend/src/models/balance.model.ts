import mongoose, { Schema, Document } from "mongoose";

export interface IBalance extends Document {
  user: mongoose.Types.ObjectId;
  token: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BalanceSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Compound index to ensure one balance record per user per token
BalanceSchema.index({ user: 1, token: 1 }, { unique: true });

export default mongoose.model<IBalance>("Balance", BalanceSchema);
