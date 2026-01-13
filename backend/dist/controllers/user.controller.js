"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceByToken = exports.getPortfolio = void 0;
const balance_model_1 = __importDefault(require("../models/balance.model"));
const getPortfolio = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const portfolio = await balance_model_1.default.find({ user: userId, amount: { $gt: 0 } })
            .populate("token")
            .sort({ updatedAt: -1 });
        return res.status(200).json({ portfolio });
    }
    catch (error) {
        console.error("Get portfolio error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getPortfolio = getPortfolio;
const getBalanceByToken = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const balance = await balance_model_1.default.findOne({ user: userId, token: tokenId });
        return res.status(200).json({ balance: balance ? balance.amount : 0 });
    }
    catch (error) {
        console.error("Get balance error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getBalanceByToken = getBalanceByToken;
