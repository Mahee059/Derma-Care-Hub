import { Request, Response } from "express";
import { db } from "../lib/prisma";

interface AuthRequest extends Request {
  user?: any;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      db.product.findMany({
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.product.count(),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecommendedProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized, Login Again!" });
      return;
    }

    // Now we simply return the latest 6 products
    const products = await db.product.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get recommended products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      description,
      ingredients,
      price,
      sustainabilityScore,
      allergens,
      externalUrl,
    } = req.body;

    const product = await db.product.create({
      data: {
        name,
        brand,
        description,
        ingredients,
        price: Number(price),
        sustainabilityScore: Number(sustainabilityScore),
        allergens,
        externalUrl,
      },
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      ingredients,
      price,
      sustainabilityScore,
      allergens,
      externalUrl,
    } = req.body;

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        brand,
        description,
        ingredients,
        price: Number(price),
        sustainabilityScore: Number(sustainabilityScore),
        allergens,
        externalUrl,
      },
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
