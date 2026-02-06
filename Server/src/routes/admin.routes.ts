import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.middleware";
import { approveDermatologist, deleteUser, getAdminStats, getAllUsers, getPendingDermatologists, updateUserRole } from "../controllers/admin.conroller";


const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("ADMIN")(req, res, next).catch(next);
});

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);
router.get("/stats", getAdminStats);
router.get("/pending-dermatologists", getPendingDermatologists);
router.patch("/dermatologists/:id/approve", approveDermatologist);

export default router;
