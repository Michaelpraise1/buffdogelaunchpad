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

// Validate required environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  console.error("FATAL: MONGODB_URI environment variable is not set.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/temple", templeRoutes);

// Database connection
const connectWithFallback = async () => {
  try {
    console.log("Attempting to connect to primary MongoDB...");
    // Set a timeout of 10s for the primary connection to fail fast if it hangs
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.warn("Primary MongoDB connection failed:", error.message || error);
    const localUri = "mongodb://127.0.0.1:27017/buffdoge";
    console.log(`Attempting fallback to local MongoDB: ${localUri}`);
    try {
      const conn = await mongoose.connect(localUri);
      console.log(`Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (localError: any) {
      console.error("Local MongoDB fallback also failed:", localError.message || localError);
      process.exit(1);
    }
  }
};

connectWithFallback().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

