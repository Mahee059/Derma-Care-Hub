import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { Role } from "@prisma/client";

/**
 * Get all dermatologists
 */
export const getDermatologists = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: {
        role: Role.DERMATOLOGIST,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get dermatologists error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get all normal users
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: {
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get logged-in user profile
 */
export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update logged-in user profile (basic fields only)
 */
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
