import { Request, Response } from "express";
import { db } from "../lib/prisma";

interface AuthRequest extends Request {
  user?: any;
}

//get profile
export const getSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//create Profile
export const createSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { allergies, goals } = req.body;

    const existingProfile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Skin profile already exists",
      });
    }

    const profile = await db.skinProfile.create({
      data: {
        userId,
        allergies,
        goals,
      },
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Create skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// updateSkinProfile
export const updateSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { allergies, goals } = req.body;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
    }

    const updatedProfile = await db.skinProfile.update({
      where: { userId },
      data: {
        allergies,
        goals,
        lastAssessment: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update skin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
