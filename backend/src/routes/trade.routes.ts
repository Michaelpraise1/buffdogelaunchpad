import { Router } from "express";
import { buyToken, sellToken, getTradeHistory } from "../controllers/trade.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = Router();

router.post("/buy", authMiddleware, buyToken);
router.post("/sell", authMiddleware, sellToken);
router.get("/history/:tokenId", getTradeHistory);

export default router;
