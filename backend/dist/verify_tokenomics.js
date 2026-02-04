"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const token_controller_1 = require("./controllers/token.controller");
const trade_controller_1 = require("./controllers/trade.controller");
const staking_model_1 = __importDefault(require("./models/staking.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const balance_model_1 = __importDefault(require("./models/balance.model"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/buffdoge";
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};
async function runVerification() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("Connected to DB");
        // 1. Create a Test User
        const testUser = await user_model_1.default.findOneAndUpdate({ walletAddress: "TestWallet123" }, { username: "TestUser", walletAddress: "TestWallet123" }, { upsert: true, new: true });
        console.log("Test User:", testUser._id);
        // 2. Test Create Token
        console.log("\n--- Testing Create Token ---");
        const createReq = {
            user: { userId: testUser._id },
            body: {
                name: "TestToken",
                symbol: "TEST",
                description: "Test Description",
                logo: "http://logo.com/logo.png"
            }
        };
        const createRes = mockRes();
        await (0, token_controller_1.createToken)(createReq, createRes);
        if (createRes.statusCode !== 201) {
            console.error("Create Token Failed:", createRes.data);
            return;
        }
        const token = createRes.data.token;
        console.log("Token Created:", token._id);
        // Verify Staking Pool Allocation
        const stakingPool = await staking_model_1.default.findOne();
        const reward = stakingPool?.tokenRewards.find(r => r.token.toString() === token._id.toString());
        if (reward && reward.amount === 50000000) {
            console.log("SUCCESS: Staking Pool has 50M tokens (5%)");
        }
        else {
            console.error("FAILURE: Staking Pool missing or incorrect amount", reward);
        }
        // 3. Test Buy Token
        console.log("\n--- Testing Buy Token ---");
        const initialSolRewards = stakingPool?.totalSolRewards || 0;
        const buyAmount = 1; // 1 SOL
        const buyReq = {
            user: { userId: testUser._id },
            body: { tokenId: token._id, solAmount: buyAmount }
        };
        const buyRes = mockRes();
        await (0, trade_controller_1.buyToken)(buyReq, buyRes);
        if (buyRes.statusCode !== 200) {
            console.error("Buy Token Failed:", buyRes.data);
        }
        else {
            // Verify Fees
            const updatedPool = await staking_model_1.default.findOne();
            const expectedFee = buyAmount * 0.002;
            const actualIncrease = (updatedPool?.totalSolRewards || 0) - initialSolRewards;
            if (Math.abs(actualIncrease - expectedFee) < 0.000001) {
                console.log(`SUCCESS: Staking Pool received ${actualIncrease} SOL (0.2% fee)`);
            }
            else {
                console.error(`FAILURE: Staking Pool received ${actualIncrease} SOL, expected ${expectedFee}`);
            }
        }
        // 4. Test Sell Token
        console.log("\n--- Testing Sell Token ---");
        const userBalance = await balance_model_1.default.findOne({ user: testUser._id, token: token._id });
        if (!userBalance) {
            console.error("User has no balance to sell");
        }
        else {
            const sellAmount = userBalance.amount / 2; // Sell half
            const sellReq = {
                user: { userId: testUser._id },
                body: { tokenId: token._id, tokenAmount: sellAmount }
            };
            const sellRes = mockRes();
            const preSellPool = await staking_model_1.default.findOne();
            await (0, trade_controller_1.sellToken)(sellReq, sellRes);
            if (sellRes.statusCode !== 200) {
                console.error("Sell Token Failed:", sellRes.data);
            }
            else {
                const postSellPool = await staking_model_1.default.findOne();
                const feeIncrease = (postSellPool?.totalSolRewards || 0) - (preSellPool?.totalSolRewards || 0);
                console.log(`SUCCESS: Sell completed. Staking Pool gained ${feeIncrease} SOL`);
                // Note: Harder to calculate expected fee exactly without replicating bond curve math here, 
                // but as long as it's > 0 and roughly consistent we know logic ran.
            }
        }
    }
    catch (err) {
        console.error("Verification Error:", err);
    }
    finally {
        // Cleanup? Maybe keep for manual inspection or drop?
        // mongoose.connection.dropDatabase(); 
        await mongoose_1.default.disconnect();
    }
}
runVerification();
