import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProductRecommendations } from "../controllers/AI.controller";


const router = express.Router();

router.use(authMiddleware);

router.get("/recommendations", getProductRecommendations);

export default router;
