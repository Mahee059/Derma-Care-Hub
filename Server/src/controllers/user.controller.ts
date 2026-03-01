import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import cloudinary from "../config/cloudinary.config";

interface AuthRequest extends Request {
  user?: any;
}

export const getDermatologist = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: { role: Role.DERMATOLOGISTS },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: { role: Role.USER },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "Email already in use",
        });
        return;
      }
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingPhone = await db.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
        return;
      }
    }

    // Handle password change
    let hashedPassword;
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile image
    let imageUrl = user.image;
    if (req.file) {
      try {
        // Delete old image if it exists
        if (user.image) {
          const publicId = user.image.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        throw new Error("Image upload failed");
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        image: imageUrl,
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
      },
    });

    res.json({
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

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid password",
      });
      return;
    }

    // Delete profile image from Cloudinary if it exists
    if (user.image) {
      try {
        const publicId = user.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
      }
    }

    // Delete user and all related data
    await db.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


