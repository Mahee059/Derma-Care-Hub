import express from "express";
import * as userController from "../controllers/user.controllers";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware";


const router = express.Router();

router.get("/", verifyToken, authorizeRoles("ADMIN"), userController.getUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), userController.updateUser);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), userController.deleteUser);

export default router;
