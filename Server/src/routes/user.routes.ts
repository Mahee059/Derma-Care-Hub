import { Router } from "express";

import { getProfile } from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, getProfile);

export default router;
