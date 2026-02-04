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
const TierRewardSchema = new mongoose_1.Schema({
    tier: { type: Number, required: true },
    mcapThreshold: { type: Number, required: true },
    maxSpots: { type: Number, required: true },
    buffdogePercentage: { type: Number, required: true },
    solPercentage: { type: Number, required: true },
    spotsUsed: { type: Number, default: 0 },
});
const TemplePhaseSchema = new mongoose_1.Schema({
    phaseNumber: { type: Number, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalBuffdogeRewards: { type: Number, required: true },
    totalSolRewards: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    tierRewards: [TierRewardSchema],
}, { timestamps: true });
// Index for finding active phase
TemplePhaseSchema.index({ isActive: 1 });
TemplePhaseSchema.index({ phaseNumber: -1 });
exports.default = mongoose_1.default.model("TemplePhase", TemplePhaseSchema);
