import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createLog, deleteLog, getComparison, getLogs } from "../controllers/progress.controller";
import { upload } from "../middlewares/file-uploader.middlwares";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getLogs);
router.post("/", upload.single ("image"), createLog);
router.delete("/:id", deleteLog);
router.get("/comparison", getComparison);

export default router;
