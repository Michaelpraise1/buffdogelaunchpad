import { Response } from "express";
import { AuthRequest } from "../config/auth.middleware";
import Comment from "../models/comment.model";
import Token from "../models/token.model";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId, content, image } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content) return res.status(400).json({ message: "Content is required" });

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ message: "Token not found" });

    const comment = await Comment.create({
      token: tokenId,
      user: userId,
      content,
      image,
    });

    // Increment replies count on token
    token.replies = (token.replies || 0) + 1;
    await token.save();

    await comment.populate("user", "username profilePicture walletAddress");

    return res.status(201).json({ comment });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { tokenId } = req.params;
    const comments = await Comment.find({ token: tokenId })
      .populate("user", "username profilePicture walletAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
