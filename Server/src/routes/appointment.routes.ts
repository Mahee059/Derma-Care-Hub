import express from "express";

import { createAppointment, deleteAppointment, getAppointments, updateAppointmentStatus } from "../controllers/appointment.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAppointments);
router.post("/", createAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;
