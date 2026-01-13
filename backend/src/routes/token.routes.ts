import { Router } from "express";
import { createToken, getAllTokens, getTokenById } from "../controllers/token.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = Router();

router.get("/", getAllTokens);
router.get("/:id", getTokenById);
router.post("/", authMiddleware, createToken);

export default router;
