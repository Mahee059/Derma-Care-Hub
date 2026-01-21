import { Router } from "express";
import { getUsers } from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUsers);

export default router;
