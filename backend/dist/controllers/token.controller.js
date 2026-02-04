"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenById = exports.getAllTokens = exports.createToken = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
const trade_model_1 = __importDefault(require("../models/trade.model"));
const balance_model_1 = __importDefault(require("../models/balance.model"));
const staking_model_1 = __importDefault(require("../models/staking.model"));
const INITIAL_VIRTUAL_SOL = 30;
const TOTAL_SUPPLY = 1000000000; // 1B Total
const STAKING_PERCENT = 0.05; // 5%
const STAKING_AMOUNT = TOTAL_SUPPLY * STAKING_PERCENT; // 50M
const INITIAL_VIRTUAL_TOKENS = TOTAL_SUPPLY - STAKING_AMOUNT; // 950M for Bonding Curve
const GRADUATION_SOL_TARGET = 86;
const createToken = async (req, res) => {
    try {
        const { name, symbol, description, logo, twitter, discord, website, github, instagram, tiktok, initialBuyAmount, // SOL amount to buy
        antiRugLimit // % of supply (e.g. 1, 2, 5)
         } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!name || !symbol || !description || !logo) {
            return res.status(400).json({ message: "Name, symbol, description, and logo are required" });
        }
        // Calculate initial state based on pre-buy
        let virtualSolReserves = INITIAL_VIRTUAL_SOL;
        let virtualTokenReserves = INITIAL_VIRTUAL_TOKENS;
        let bondingCurveProgress = 0;
        let marketCap = 0;
        let tokensBought = 0;
        if (initialBuyAmount && initialBuyAmount > 0) {
            const currentX = virtualSolReserves;
            const currentY = virtualTokenReserves;
            const k = currentX * currentY;
            const nextX = currentX + Number(initialBuyAmount);
            const nextY = k / nextX;
            tokensBought = currentY - nextY;
            virtualSolReserves = nextX;
            virtualTokenReserves = nextY;
            const addedSol = virtualSolReserves - INITIAL_VIRTUAL_SOL;
            bondingCurveProgress = Math.min((addedSol / GRADUATION_SOL_TARGET) * 100, 100);
            marketCap = virtualSolReserves * 200; // Mock price
        }
        // Calculate Max Wallet Limit
        let maxWalletLimit;
        if (antiRugLimit) {
            // e.g. 1% of 1B = 10,000,000
            maxWalletLimit = (INITIAL_VIRTUAL_TOKENS * antiRugLimit) / 100;
        }
        const token = await token_model_1.default.create({
            name,
            symbol,
            description,
            logo,
            creator: userId,
            twitter,
            discord,
            website,
            github,
            instagram,
            tiktok,
            virtualSolReserves,
            virtualTokenReserves,
            bondingCurveProgress,
            marketCap,
            maxWalletLimit,
            creatorBuyAmount: initialBuyAmount || 0
        });
        // Allocate 5% to Staking Pool
        let stakingPool = await staking_model_1.default.findOne();
        if (!stakingPool) {
            stakingPool = await staking_model_1.default.create({ totalSolRewards: 0, tokenRewards: [] });
        }
        stakingPool.tokenRewards.push({
            token: token._id,
            amount: STAKING_AMOUNT,
            symbol: token.symbol
        });
        await stakingPool.save();
        // If pre-buy, create trade record and update balance
        if (tokensBought > 0) {
            await trade_model_1.default.create({
                token: token._id,
                user: userId,
                type: "buy",
                solAmount: initialBuyAmount,
                tokenAmount: tokensBought,
                priceAtTrade: initialBuyAmount / tokensBought
            });
            await balance_model_1.default.findOneAndUpdate({ user: userId, token: token._id }, { $inc: { amount: tokensBought } }, { upsert: true, new: true });
        }
        return res.status(201).json({ token });
    }
    catch (error) {
        console.error("Create token error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createToken = createToken;
const getAllTokens = async (req, res) => {
    try {
        const tokens = await token_model_1.default.find()
            .populate("creator", "username walletAddress profilePicture")
            .sort({ createdAt: -1 });
        return res.status(200).json({ tokens });
    }
    catch (error) {
        console.error("Get all tokens error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllTokens = getAllTokens;
const getTokenById = async (req, res) => {
    try {
        const { id } = req.params;
        const token = await token_model_1.default.findById(id).populate("creator", "username walletAddress profilePicture");
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Get token by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTokenById = getTokenById;
