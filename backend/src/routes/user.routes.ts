import { Router } from "express";
import { getPortfolio, getBalanceByToken } from "../controllers/user.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = Router();

router.get("/portfolio", authMiddleware, getPortfolio);
router.get("/balance/:tokenId", authMiddleware, getBalanceByToken);

export default router;
