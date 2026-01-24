import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  name: string;
  symbol: string;
  description: string;
  logo: string;
  creator: mongoose.Types.ObjectId;
  twitter?: string;
  discord?: string;
  website?: string;
  github?: string;
  instagram?: string;
  tiktok?: string;
  mintAddress?: string;
  marketCap: number;
  replies: number;
  bondingCurveProgress: number;
  virtualSolReserves: number;
  virtualTokenReserves: number;
  isGraduated: boolean;
  graduatedAt?: Date;
  migrationHash?: string;
  maxWalletLimit?: number; // Anti-rug: Max tokens a wallet can hold
  creatorBuyAmount?: number; // Pre-buy amount
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    twitter: { type: String },
    discord: { type: String },
    website: { type: String },
    github: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    mintAddress: { type: String },
    marketCap: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    bondingCurveProgress: { type: Number, default: 0 },
    virtualSolReserves: { type: Number, default: 30 }, // Start with 30 SOL virtual liquidity
    virtualTokenReserves: { type: Number, default: 1000000000 }, // 1B tokens
    isGraduated: { type: Boolean, default: false },
    graduatedAt: { type: Date },
    migrationHash: { type: String },
    maxWalletLimit: { type: Number },
    creatorBuyAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IToken>("Token", TokenSchema);
