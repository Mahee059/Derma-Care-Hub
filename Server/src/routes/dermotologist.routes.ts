import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.middleware";
import { getDermatologistStats, getPatientDetails, getPatients, getRecentActivity } from "../controllers/dermotologist.controllers";


const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("DERMATOLOGISTS")(req, res, next).catch(next);
});

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientDetails);
router.get("/stats", getDermatologistStats);
router.get("/activity", getRecentActivity);

export default router;
