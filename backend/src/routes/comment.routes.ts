import { Router } from "express";
import { addComment, getComments } from "../controllers/comment.controller";
import { authMiddleware } from "../config/auth.middleware";

const router = Router();

router.get("/:tokenId", getComments);
router.post("/", authMiddleware, addComment);

export default router;
