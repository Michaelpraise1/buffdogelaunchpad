import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
  token: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: "buy" | "sell";
  solAmount: number;
  tokenAmount: number;
  priceAtTrade: number;
  createdAt: Date;
}

const TradeSchema: Schema = new Schema(
  {
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["buy", "sell"], required: true },
    solAmount: { type: Number, required: true },
    tokenAmount: { type: Number, required: true },
    priceAtTrade: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITrade>("Trade", TradeSchema);
