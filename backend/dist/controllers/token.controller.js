"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenById = exports.getAllTokens = exports.createToken = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
const createToken = async (req, res) => {
    try {
        const { name, symbol, description, logo, twitter, discord, website, github, instagram, tiktok } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!name || !symbol || !description || !logo) {
            return res.status(400).json({ message: "Name, symbol, description, and logo are required" });
        }
        const token = await token_model_1.default.create({
            name,
            symbol,
            description,
            logo,
            creator: userId,
            twitter,
            discord,
            website,
            github,
            instagram,
            tiktok
        });
        return res.status(201).json({ token });
    }
    catch (error) {
        console.error("Create token error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createToken = createToken;
const getAllTokens = async (req, res) => {
    try {
        const tokens = await token_model_1.default.find()
            .populate("creator", "username walletAddress profilePicture")
            .sort({ createdAt: -1 });
        return res.status(200).json({ tokens });
    }
    catch (error) {
        console.error("Get all tokens error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllTokens = getAllTokens;
const getTokenById = async (req, res) => {
    try {
        const { id } = req.params;
        const token = await token_model_1.default.findById(id).populate("creator", "username walletAddress profilePicture");
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Get token by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTokenById = getTokenById;
