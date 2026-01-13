import { Router } from "express";
import { loginOrRegister, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = Router();

router.post("/wallet", loginOrRegister);
router.patch("/profile", authMiddleware, updateProfile);

export default router;
