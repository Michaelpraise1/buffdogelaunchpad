import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import tokenRoutes from "./routes/token.routes";
import tradeRoutes from "./routes/trade.routes";
import userRoutes from "./routes/user.routes";
import commentRoutes from "./routes/comment.routes";
import stakingRoutes from "./routes/staking.routes";
import templeRoutes from "./routes/temple.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/buffdoge";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/temple", templeRoutes);

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then((conn) => {
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
