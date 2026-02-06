import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProductRecommendations } from "../controllers/AI.controllers";


const router = express.Router();

router.use(authMiddleware);

router.get("/recommendations", getProductRecommendations);

export default router;
