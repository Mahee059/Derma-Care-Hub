import { Request, Response } from "express";
import { db } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma, Role } from "@prisma/client";
import { sendRegistrationConfirmationEmail } from "../config/email";
import { generateAccessToken } from "../utils/jwt";

interface AuthRequest extends Request {
  user?: {
    id: string; // ✅ UUID string (matches Prisma)
    role: Role;
  };
}

/**
 * REGISTER USER
 */
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, dermatologistId } = req.body;

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({
      success: false,
      message: "Missing details",
    });
  }

  // Dermatologist must provide dermatologistId
  if (role === "DERMATOLOGISTS" && !dermatologistId) {
    return res.status(400).json({
      success: false,
      message:
        "Dermatologist ID is required for dermatologist registration",
    });
  }

  try {
    /**
     * Check existing email
     */
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    /**
     * Check existing phone
     */
    const existingPhone = await db.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return res.status(401).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    /**
     * Check dermatologistId uniqueness
     */
    if (dermatologistId) {
      const existingDerm = await db.user.findUnique({
        where: { dermatologistId },
      });

      if (existingDerm) {
        return res.status(401).json({
          success: false,
          message: "Dermatologist ID already exists",
        });
      }
    }

    /**
     * Hash password
     */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /**
     * Validate role
     */
    const allowedRoles: Role[] = [
      "USER",
      "DERMATOLOGISTS",
      "ADMIN",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    /**
     * Create user
     */
    const userData: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      role,
      name,
      phone,
      ...(dermatologistId && { dermatologistId }),
      status:
        role === "DERMATOLOGISTS"
          ? "PENDING"
          : "APPROVED",
    };

    const createdUser = await db.user.create({
      data: userData,
    });

    /**
     * Dermatologist requires approval
     */
    if (role === "DERMATOLOGISTS") {
      if (dermatologistId) {
        await sendRegistrationConfirmationEmail(
          createdUser.email,
          createdUser.name || "",
          dermatologistId
        );
      }

      const admins = await db.user.findMany({
        where: { role: "ADMIN" },
      });

      for (const admin of admins) {
        await db.notification.create({
          data: {
            userId: admin.id,
            type: "SYSTEM",
            title: "New Dermatologist Registration",
            message: `Dr. ${createdUser.name} (ID: ${dermatologistId}) requested approval.`,
          },
        });
      }

      return res.status(201).json({
        success: true,
        message:
          "Registration submitted. Wait for admin approval.",
        requiresApproval: true,
      });
    }

    /**
     * Generate JWT
     */
    const token = generateAccessToken({
      id: createdUser.id, // ✅ string UUID
      role: createdUser.role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        phone: createdUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /**
     * Dermatologist approval check
     */
    if (
      existingUser.role === "DERMATOLOGISTS" &&
      existingUser.status !== "APPROVED"
    ) {
      let message = "Account pending approval";

      if (existingUser.status === "REJECTED") {
        message =
          "Account rejected. Contact administrator.";
      }

      return res.status(401).json({
        success: false,
        message,
        status: existingUser.status,
      });
    }

    /**
     * Compare password
     */
    const isMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /**
     * Generate JWT
     */
    const token = generateAccessToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        phone: existingUser.phone,
        image: existingUser.image,
        dermatologistId:
          existingUser.dermatologistId,
        status: existingUser.status,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * GET CURRENT USER
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id, // ✅ string UUID
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        dermatologistId: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};