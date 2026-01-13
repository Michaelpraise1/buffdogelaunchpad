"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.addComment = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const token_model_1 = __importDefault(require("../models/token.model"));
const addComment = async (req, res) => {
    try {
        const { tokenId, content, image } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!content)
            return res.status(400).json({ message: "Content is required" });
        const token = await token_model_1.default.findById(tokenId);
        if (!token)
            return res.status(404).json({ message: "Token not found" });
        const comment = await comment_model_1.default.create({
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
    }
    catch (error) {
        console.error("Add comment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addComment = addComment;
const getComments = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const comments = await comment_model_1.default.find({ token: tokenId })
            .populate("user", "username profilePicture walletAddress")
            .sort({ createdAt: -1 });
        return res.status(200).json({ comments });
    }
    catch (error) {
        console.error("Get comments error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getComments = getComments;
