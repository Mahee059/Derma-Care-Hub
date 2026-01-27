import express from "express";
import {
  getProducts,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware, authorize } from "../middlewares/auth.middleware"


const router = express.Router();

router.get("/", getProducts);
router.get("/recommended", authMiddleware, getRecommendedProducts);
router.get("/:id", getProductById);

// Admin routes
router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("ADMIN")(req, res, next).catch(next);
});

router.post("/", createProduct);
router.put("/:id",  updateProduct);
router.delete("/:id", deleteProduct);

export default router;
