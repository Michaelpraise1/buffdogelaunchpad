"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
router.post("/wallet", auth_controller_1.loginOrRegister);
router.patch("/profile", auth_middleware_1.authMiddleware, auth_controller_1.updateProfile);
exports.default = router;
