import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { SkinType, SkinConcern } from "@prisma/client";

interface AuthRequest extends Request {
  user?: any;
}

export const getSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
      include: {
        SkinType: true,
        Concerns: true,
      },
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
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

export const createSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { skinType, concerns, allergies, goals } = req.body;

    if (!skinType || !concerns || !Array.isArray(concerns)) {
      res.status(400).json({
        success: false,
        message: "Skin type and concerns are required",
      });
      return;
    }

    // Check if profile already exists
    const existingProfile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: "Skin profile already exists",
      });
      return;
    }

    // Create profile with related records
    const profile = await db.skinProfile.create({
      data: {
        userId,
        allergies,
        goals,
        SkinType: {
          create: skinType.map((type: { type: SkinType }) => ({
            type: type.type,
          })),
        },
        Concerns: {
          create: concerns.map((concern: { concern: SkinConcern }) => ({
            concern: concern.concern,
          })),
        },
      },
      include: {
        SkinType: true,
        Concerns: true,
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

export const updateSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { skinType, concerns, allergies, goals } = req.body;

    const profile = await db.skinProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    // Delete existing skin types and concerns
    await db.skinTypeOnProfile.deleteMany({
      where: { skinProfileId: profile.id },
    });
    await db.skinConcernOnProfile.deleteMany({
      where: { skinProfileId: profile.id },
    });

    // Update profile with new data
    const updatedProfile = await db.skinProfile.update({
      where: { userId },
      data: {
        allergies,
        goals,
        lastAssessment: new Date(),
        SkinType: {
          create: skinType.map((type: { type: SkinType }) => ({
            type: type.type,
          })),
        },
        Concerns: {
          create: concerns.map((concern: { concern: SkinConcern }) => ({
            concern: concern.concern,
          })),
        },
      },
      include: {
        SkinType: true,
        Concerns: true,
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
