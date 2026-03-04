import express from "express";
import { getDermatologistStats } from "../controllers/dermatologist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/file-uploader.middlwares";
import { deleteProfile, updateProfile } from "../controllers/user.controller";
import { getAllUsers } from "../controllers/admin.conroller";


const router = express.Router();

router.use(authMiddleware);

router.put("/profile", upload.single("image"), updateProfile);
router.delete("/profile", deleteProfile);
router.get("/dermotologist", getDermatologistStats);
router.get("/user", getAllUsers);

export default router;
