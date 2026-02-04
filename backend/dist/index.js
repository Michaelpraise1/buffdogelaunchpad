"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const token_routes_1 = __importDefault(require("./routes/token.routes"));
const trade_routes_1 = __importDefault(require("./routes/trade.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const staking_routes_1 = __importDefault(require("./routes/staking.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/buffdoge";
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/tokens", token_routes_1.default);
app.use("/api/trades", trade_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/staking", staking_routes_1.default);
// Database connection
mongoose_1.default
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
