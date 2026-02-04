import { Router } from "express";
import { getAchievements, getCurrentPhase } from "../controllers/temple.controller";

const router = Router();

router.get("/phase/current", getCurrentPhase);
router.get("/achievements", getAchievements);

export default router;
