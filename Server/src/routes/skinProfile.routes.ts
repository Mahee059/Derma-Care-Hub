import express from "express";
import {
  getSkinProfile,
  createSkinProfile,
  updateSkinProfile,
} from "../controllers/skinProfile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSkinProfile);
router.post("/", createSkinProfile);
router.put("/", updateSkinProfile);

export default router;
