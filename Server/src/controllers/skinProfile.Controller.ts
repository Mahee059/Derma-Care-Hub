import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { SkinType, SkinConcern } from "@prisma/client";

interface AuthRequest extends Request {
  user?: any;
}

const validSkinTypes = Object.values(SkinType); 
const validConcerns = Object.values(SkinConcern); 

//  GET Skin Profile 
export const getSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await db.skinProfile.findUnique({
      where: { userId },
      include: { SkinType: true, Concerns: true },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Skin profile not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get skin profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------- CREATE Skin Profile -------------------
export const createSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    let { skinTypes, concerns, allergies, goals } = req.body;

    if (!skinTypes || !concerns || !Array.isArray(skinTypes) || !Array.isArray(concerns)) {
      return res.status(400).json({
        success: false,
        message: "Skin types and concerns are required and must be arrays",
      });
    }

    // ---------------- Convert to uppercase and validate enums ----------------
    const skinTypesUpper: SkinType[] = skinTypes.map((t: string) => {
      const val = t.toUpperCase() as SkinType;
      if (!validSkinTypes.includes(val)) throw new Error(`Invalid skin type: ${t}`);
      return val;
    });

    const concernsUpper: SkinConcern[] = concerns.map((c: string) => {
      const val = c.toUpperCase() as SkinConcern;
      if (!validConcerns.includes(val)) throw new Error(`Invalid concern: ${c}`);
      return val;
    });

    // Check if profile exists
    const existingProfile = await db.skinProfile.findUnique({ where: { userId } });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: "Skin profile already exists" });
    }

    // ---------------- Create profile ----------------
    const profile = await db.skinProfile.create({
      data: {
        userId,
        allergies,
        goals,
        SkinType: { create: skinTypesUpper.map((t: SkinType) => ({ type: t })) },
        Concerns: { create: concernsUpper.map((c: SkinConcern) => ({ concern: c })) },
      },
      include: { SkinType: true, Concerns: true },
    });

    return res.status(201).json({ success: true, profile });
  } catch (error: any) {
    console.error("Create skin profile error:", error);
    return res.status(400).json({ success: false, message: error.message || "Internal server error" });
  }
};

//  UPDATE Skin Profile 
export const updateSkinProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    let { skinTypes, concerns, allergies, goals } = req.body;

    if (!skinTypes || !concerns || !Array.isArray(skinTypes) || !Array.isArray(concerns)) {
      return res.status(400).json({
        success: false,
        message: "Skin types and concerns are required and must be arrays",
      });
    }

    // Convert to uppercase and validate enums 
    const skinTypesUpper: SkinType[] = skinTypes.map((t: string) => {
      const val = t.toUpperCase() as SkinType;
      if (!validSkinTypes.includes(val)) throw new Error(`Invalid skin type: ${t}`);
      return val;
    });

    const concernsUpper: SkinConcern[] = concerns.map((c: string) => {
      const val = c.toUpperCase() as SkinConcern;
      if (!validConcerns.includes(val)) throw new Error(`Invalid concern: ${c}`);
      return val;
    });

    // Find existing profile
    const profile = await db.skinProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Skin profile not found" });
    }

    // Delete old join table records
    await db.skinTypeOnProfile.deleteMany({ where: { skinProfileId: profile.id } });
    await db.skinConcernOnProfile.deleteMany({ where: { skinProfileId: profile.id } });

    // Update profile
    const updatedProfile = await db.skinProfile.update({
      where: { userId },
      data: {
        allergies,
        goals,
        lastAssessment: new Date(),
        SkinType: { create: skinTypesUpper.map((t: SkinType) => ({ type: t })) },
        Concerns: { create: concernsUpper.map((c: SkinConcern) => ({ concern: c })) },
      },
      include: { SkinType: true, Concerns: true },
    });

    return res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Update skin profile error:", error);
    return res.status(400).json({ success: false, message: error.message || "Internal server error" });
  }
};