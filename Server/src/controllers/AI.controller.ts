import { Request, Response } from "express";
import fetch from "node-fetch";
import { db } from "../lib/prisma";

interface AuthRequest extends Request {
  user?: any;
}

const HUGGING_FACE_API = "https://huggingface.co/deepseek-ai/DeepSeek-V3-0324";

export const getProductRecommendations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    if (!process.env.HUGGING_FACE_API_KEY) {
      throw new Error("Hugging Face API key is not configured");
    }

    // Get user's skin profile
    const skinProfile = await db.skinProfile.findUnique({
      where: { userId },
      include: {
        SkinType: true,
        Concerns: true,
      },
    });

    if (!skinProfile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    // Get matching products from database based on skin profile
    const products = await db.product.findMany({
      where: {
        suitableSkinTypes: {
          some: {
            type: {
              in: skinProfile.SkinType.map((s) => s.type),
            },
          },
        },
        targetConcerns: {
          some: {
            concern: {
              in: skinProfile.Concerns.map((c) => c.concern),
            },
          },
        },
      },
      take: 5,
      include: {
        suitableSkinTypes: true,
        targetConcerns: true,
      },
    });

    let aiRecommendations = "";

    try {
      const skinTypes = skinProfile.SkinType.map((s) => s.type).join(", ");
      const concerns = skinProfile.Concerns.map((c) => c.concern).join(", ");
      const allergies = skinProfile.allergies || "None";

      // Generate input text for the model
      const input = `Generate skincare recommendations for someone with:
      Skin Types: ${skinTypes}
      Skin Concerns: ${concerns}
      Allergies: ${allergies}
      Goals: ${skinProfile.goals}

      Please provide specific recommendations for their skincare routine.`;

      // Call Hugging Face API
      const response = await fetch(HUGGING_FACE_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: input, max_length: 500 }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const result = await response.json();
      aiRecommendations = Array.isArray(result)
        ? result[0].generated_text
        : result.generated_text;
    } catch (aiError) {
      console.error("AI recommendations error:", aiError);
      // Provide a fallback response when AI service is unavailable
      aiRecommendations = `Based on your skin profile, here are some general recommendations:

1. For your ${skinProfile.SkinType[0].type.toLowerCase()} skin type:
   - Focus on products that maintain skin balance
   - Use gentle, non-irritating formulations

2. To address your concerns (${skinProfile.Concerns.map((c) =>
        c.concern.toLowerCase()
      ).join(", ")}):
   - Look for products with targeted active ingredients
   - Follow a consistent skincare routine

3. Consider your specific goals: ${skinProfile.goals}

The products shown below are specifically matched to your skin type and concerns.`;
    }

    res.json({
      success: true,
      aiRecommendations,
      matchingProducts: products,
    });
  } catch (error) {
    console.error("AI recommendations error:", error);
    res.status(500).json({
      success: false,
      message:
        "Could not generate recommendations at this time. Please try again later.",
    });
  }
};
