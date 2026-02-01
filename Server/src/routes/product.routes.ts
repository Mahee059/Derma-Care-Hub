
import express from "express";

import { authMiddleware, authorize } from "../middlewares/auth.middleware";
import { getProductById, getProducts, getRecommendedProducts } from "../controllers/product.controller";
import { upload } from "../middlewares/file-uploader.middlwares";
 

//multer uploader 
const uploader = upload 

const router = express.Router();

router.get("/", getProducts);
router.get("/recommended", authMiddleware, getRecommendedProducts);
router.get("/:id", getProductById);

// Admin routes
router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("ADMIN")(req, res, next).catch(next);
}); 
 

export default router;
