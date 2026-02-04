"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeHistory = exports.sellToken = exports.buyToken = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
const trade_model_1 = __importDefault(require("../models/trade.model"));
const balance_model_1 = __importDefault(require("../models/balance.model"));
const staking_model_1 = __importDefault(require("../models/staking.model"));
const user_stake_model_1 = __importDefault(require("../models/user-stake.model"));
const INITIAL_VIRTUAL_SOL = 30;
// Note: INITIAL_VIRTUAL_TOKENS must match token.controller (950M if strictly used for calc, but here we read from DB usually)
// However, calculate Progress uses INITIAL_VIRTUAL_SOL.
const GRADUATION_SOL_TARGET = 86; // 80 SOL Liquidity + 6 SOL Fee
const MIGRATION_SOL_AMOUNT = 80;
const TEAM_FEE_SOL_AMOUNT = 6;
const FEE_PERCENT = 0.002; // 0.2%
const buyToken = async (req, res) => {
    try {
        const { tokenId, solAmount } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!solAmount || solAmount <= 0)
            return res.status(400).json({ message: "Invalid SOL amount" });
        const token = await token_model_1.default.findById(tokenId);
        if (!token)
            return res.status(404).json({ message: "Token not found" });
        if (token.isGraduated) {
            return res.status(400).json({ message: "Token has already graduated and trading is moved to DEX" });
        }
        // Calculate Fee
        const feeAmount = solAmount * FEE_PERCENT;
        const netSolAmount = solAmount - feeAmount;
        // Calculate tokens to receive using Constant Product Formula (X * Y = K)
        const currentX = token.virtualSolReserves;
        const currentY = token.virtualTokenReserves;
        const k = currentX * currentY;
        const nextX = currentX + netSolAmount;
        const nextY = k / nextX;
        const tokensToReceive = currentY - nextY;
        // Check Anti-Rug Max Wallet Limit
        if (token.maxWalletLimit) {
            const userBalance = await balance_model_1.default.findOne({ user: userId, token: tokenId });
            const currentAmount = userBalance ? userBalance.amount : 0;
            if (currentAmount + tokensToReceive > token.maxWalletLimit) {
                return res.status(400).json({
                    message: `Anti-Rug Mode: You can only hold max ${token.maxWalletLimit} tokens`
                });
            }
        }
        // Update Token State
        token.virtualSolReserves = nextX;
        token.virtualTokenReserves = nextY;
        // Calculate Progress
        const addedSol = token.virtualSolReserves - INITIAL_VIRTUAL_SOL;
        token.bondingCurveProgress = Math.min((addedSol / GRADUATION_SOL_TARGET) * 100, 100);
        // Graduation Check
        if (token.bondingCurveProgress >= 100 && !token.isGraduated) {
            token.isGraduated = true;
            token.graduatedAt = new Date();
            token.migrationHash = "mock_tx_hash_" + Date.now(); // Simulation
            console.log(`Token ${token.name} Graduated!`);
            console.log(`Migrating ${MIGRATION_SOL_AMOUNT} SOL to Meteora`);
            console.log(`Transferring ${TEAM_FEE_SOL_AMOUNT} SOL to Team Wallet`);
            // Distribute 5% of token supply as airdrop to BUFFDOGE stakers
            const AIRDROP_PERCENTAGE = 0.05;
            const totalSupply = 1000000000; // 1B tokens (from token.model.ts default)
            const airdropAmount = totalSupply * AIRDROP_PERCENTAGE; // 50M tokens
            // Get all stakers and their proportions
            const stakingPool = await staking_model_1.default.findOne();
            if (stakingPool && stakingPool.totalStaked > 0) {
                const allStakers = await user_stake_model_1.default.find({ stakedAmount: { $gt: 0 } });
                for (const staker of allStakers) {
                    const stakerShare = staker.stakedAmount / stakingPool.totalStaked;
                    const stakerAirdropAmount = airdropAmount * stakerShare;
                    // Add airdrop to user's token airdrops
                    staker.tokenAirdrops.push({
                        token: tokenId,
                        symbol: token.symbol,
                        amount: stakerAirdropAmount,
                        receivedAt: new Date(),
                        claimed: false,
                    });
                    await staker.save();
                    // Also credit their balance directly
                    await balance_model_1.default.findOneAndUpdate({ user: staker.user, token: tokenId }, { $inc: { amount: stakerAirdropAmount } }, { upsert: true });
                }
                console.log(`Airdropped ${airdropAmount} ${token.symbol} to ${allStakers.length} stakers`);
            }
        }
        // Update Market Cap (Dummy calc for now: 1 SOL = $200)
        // In a real app, this would use a price oracle
        const SOL_PRICE_USD = 200;
        token.marketCap = token.virtualSolReserves * SOL_PRICE_USD;
        await token.save();
        // Create Trade Record
        const trade = await trade_model_1.default.create({
            token: tokenId,
            user: userId,
            type: "buy",
            solAmount,
            tokenAmount: tokensToReceive,
            priceAtTrade: solAmount / tokensToReceive
        });
        // Update User Balance
        await balance_model_1.default.findOneAndUpdate({ user: userId, token: tokenId }, { $inc: { amount: tokensToReceive } }, { upsert: true, new: true });
        // Update Staking Pool Rewards (0.2% to stakers)
        await staking_model_1.default.findOneAndUpdate({}, { $inc: { totalSolRewards: feeAmount } }, { upsert: true });
        // For graduated tokens, also distribute holder rewards (0.2% to holders)
        // Note: According to docs, holder rewards go directly to wallets based on % of supply held
        // This is a simplified implementation - in production, this would be handled by smart contracts
        if (token.isGraduated) {
            // Get all token holders
            const holders = await balance_model_1.default.find({ token: tokenId, amount: { $gt: 0 } });
            const totalHolderSupply = holders.reduce((sum, h) => sum + h.amount, 0);
            if (totalHolderSupply > 0) {
                // Distribute holder rewards proportionally
                for (const holder of holders) {
                    const holderShare = holder.amount / totalHolderSupply;
                    const holderReward = feeAmount * holderShare;
                    // In a real implementation, this would credit SOL to their wallet
                    // For now, we'll track it (could be added to a HolderReward model if needed)
                    console.log(`Holder ${holder.user} receives ${holderReward} SOL (${(holderShare * 100).toFixed(2)}% of fees)`);
                }
            }
        }
        return res.status(200).json({
            message: "Purchase successful",
            trade,
            tokenState: {
                progress: token.bondingCurveProgress,
                marketCap: token.marketCap
            }
        });
    }
    catch (error) {
        console.error("Buy error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.buyToken = buyToken;
const sellToken = async (req, res) => {
    try {
        const { tokenId, tokenAmount } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!tokenAmount || tokenAmount <= 0)
            return res.status(400).json({ message: "Invalid token amount" });
        const token = await token_model_1.default.findById(tokenId);
        if (!token)
            return res.status(404).json({ message: "Token not found" });
        if (token.isGraduated) {
            return res.status(400).json({ message: "Token has already graduated and trading is moved to DEX" });
        }
        // Check User Balance
        const balance = await balance_model_1.default.findOne({ user: userId, token: tokenId });
        if (!balance || balance.amount < tokenAmount) {
            return res.status(400).json({ message: "Insufficient token balance" });
        }
        // Calculate SOL to receive
        const currentX = token.virtualSolReserves;
        const currentY = token.virtualTokenReserves;
        const k = currentX * currentY;
        const nextY = currentY + tokenAmount;
        const nextX = k / nextY;
        const solToReceive = currentX - nextX;
        // Fee Calculation
        const feeAmount = solToReceive * FEE_PERCENT;
        const netSolToUser = solToReceive - feeAmount;
        if (netSolToUser <= 0)
            return res.status(400).json({ message: "Token amount too small (after fees)" });
        // Update Token State
        token.virtualSolReserves = nextX;
        token.virtualTokenReserves = nextY;
        // Calculate Progress
        const addedSol = token.virtualSolReserves - INITIAL_VIRTUAL_SOL;
        token.bondingCurveProgress = Math.max((addedSol / GRADUATION_SOL_TARGET) * 100, 0);
        const SOL_PRICE_USD = 200;
        token.marketCap = token.virtualSolReserves * SOL_PRICE_USD;
        await token.save();
        // Create Trade Record
        const trade = await trade_model_1.default.create({
            token: tokenId,
            user: userId,
            type: "sell",
            solAmount: netSolToUser, // User receives this
            tokenAmount,
            priceAtTrade: netSolToUser / tokenAmount
        });
        // Update Staking Pool Rewards (0.2% to stakers)
        await staking_model_1.default.findOneAndUpdate({}, { $inc: { totalSolRewards: feeAmount } }, { upsert: true });
        // For graduated tokens, also distribute holder rewards (0.2% to holders)
        if (token.isGraduated) {
            const holders = await balance_model_1.default.find({ token: tokenId, amount: { $gt: 0 } });
            const totalHolderSupply = holders.reduce((sum, h) => sum + h.amount, 0);
            if (totalHolderSupply > 0) {
                for (const holder of holders) {
                    const holderShare = holder.amount / totalHolderSupply;
                    const holderReward = feeAmount * holderShare;
                    console.log(`Holder ${holder.user} receives ${holderReward} SOL from sell fees`);
                }
            }
        }
        // Update User Balance
        balance.amount -= tokenAmount;
        await balance.save();
        return res.status(200).json({
            message: "Sale successful",
            trade,
            tokenState: {
                progress: token.bondingCurveProgress,
                marketCap: token.marketCap
            }
        });
    }
    catch (error) {
        console.error("Sell error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sellToken = sellToken;
const getTradeHistory = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const trades = await trade_model_1.default.find({ token: tokenId })
            .populate("user", "username walletAddress")
            .sort({ createdAt: -1 })
            .limit(50);
        return res.status(200).json({ trades });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching trades" });
    }
};
exports.getTradeHistory = getTradeHistory;
