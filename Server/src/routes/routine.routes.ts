import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createRoutine, deleteRoutine, getRoutineById, getRoutines, updateRoutine } from "../controllers/routine.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getRoutines);
router.get("/:id", getRoutineById);
router.post("/", createRoutine);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;
