"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staking_controller_1 = require("../controllers/staking.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.get("/stats", staking_controller_1.getPoolStats);
// Protected routes
router.post("/stake", auth_middleware_1.authMiddleware, staking_controller_1.stakeTokens);
router.post("/withdraw/instant", auth_middleware_1.authMiddleware, staking_controller_1.withdrawInstant);
router.post("/withdraw/standard", auth_middleware_1.authMiddleware, staking_controller_1.withdrawStandard);
router.post("/withdraw/cancel", auth_middleware_1.authMiddleware, staking_controller_1.cancelWithdrawal);
router.post("/withdraw/complete", auth_middleware_1.authMiddleware, staking_controller_1.completeWithdrawal);
router.get("/user", auth_middleware_1.authMiddleware, staking_controller_1.getUserStake);
router.get("/rewards", auth_middleware_1.authMiddleware, staking_controller_1.getUserRewards);
router.post("/claim", auth_middleware_1.authMiddleware, staking_controller_1.claimSolRewards);
exports.default = router;
