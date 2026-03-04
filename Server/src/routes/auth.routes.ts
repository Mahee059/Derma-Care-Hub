import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getCurrentUser, loginUser, registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
