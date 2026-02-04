"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const HolderSnapshotSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    percentage: { type: Number, required: true },
});
const TempleAchievementSchema = new mongoose_1.Schema({
    token: { type: mongoose_1.Schema.Types.ObjectId, ref: "Token", required: true },
    phase: { type: mongoose_1.Schema.Types.ObjectId, ref: "TemplePhase", required: true },
    tier: { type: Number, required: true },
    mcapThreshold: { type: Number, required: true },
    timerStartedAt: { type: Date },
    achievedAt: { type: Date },
    holderSnapshot: [HolderSnapshotSchema],
    rewardsDistributed: { type: Boolean, default: false },
    spotNumber: { type: Number, required: true },
    buffdogeReward: { type: Number, default: 0 },
    solReward: { type: Number, default: 0 },
}, { timestamps: true });
// Indexes for efficient queries
TempleAchievementSchema.index({ token: 1, phase: 1 });
TempleAchievementSchema.index({ phase: 1, tier: 1 });
TempleAchievementSchema.index({ achievedAt: 1 });
exports.default = mongoose_1.default.model("TempleAchievement", TempleAchievementSchema);
