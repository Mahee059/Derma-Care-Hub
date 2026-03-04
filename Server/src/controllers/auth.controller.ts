import { Request, Response } from "express";
import { db } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma, Role } from "@prisma/client";
import { sendRegistrationConfirmationEmail } from "../config/email";
import { generateAccessToken } from "../utils/jwt";

interface AuthRequest extends Request {
  user?: any;
}

// Register user controller
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, dermatologistId } = req.body;

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  if (role === "DERMATOLOGISTS" && !dermatologistId) {
    return res.status(400).json({
      success: false,
      message: "Dermatologist ID is required for dermatologist registration",
    });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already exists" });
    }

    const existingNumber = await db.user.findUnique({ where: { phone } });
    if (existingNumber) {
      return res.status(401).json({ success: false, message: "Phone number already exists" });
    }

    if (dermatologistId) {
      const existingDermId = await db.user.findFirst({ where: { dermatologistId } });
      if (existingDermId) {
        return res.status(401).json({ success: false, message: "Dermatologist ID already exists" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Validate roles
    const allowedRoles = ["USER", "DERMATOLOGISTS", "ADMIN"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Create user data
    const userData: Prisma.UserCreateInput = {
      email,
      password: hashPassword,
      role,
      name,
      phone,
      ...(dermatologistId && { dermatologistId }),
      status: role === "DERMATOLOGISTS" ? "PENDING" : "APPROVED",
    };

    const createdUser = await db.user.create({ data: userData });

    // If dermatologist, notify admin and don't provide token
    if (role === "DERMATOLOGISTS") {
      await sendRegistrationConfirmationEmail(
        createdUser.email,
        createdUser.name,
        dermatologistId
      );

      const admins = await db.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        await db.notification.create({
          data: {
            userId: admin.id,
            type: "SYSTEM",
            title: "New Dermatologist Registration",
            message: `Dr. ${createdUser.name} (ID: ${dermatologistId}) has requested access. Please review and approve.`,
          },
        });
      }

      return res.status(201).json({
        success: true,
        message:
          "Registration submitted successfully. Please check your email for confirmation and wait for admin approval.",
        requiresApproval: true,
      });
    }

    //  Generate JWT using id + role
    const token = generateAccessToken({
      id: createdUser.id,
      role: createdUser.role as Role,
    });

    res.status(201).json({
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
    console.error("Register User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login user controller
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (
      existingUser.role === "DERMATOLOGISTS" &&
      existingUser.status !== "APPROVED"
    ) {
      let message = "Your account is pending approval.";
      if (existingUser.status === "REJECTED") {
        message = "Your account has been rejected. Please contact support.";
      }
      return res.status(401).json({
        success: false,
        message,
        status: existingUser.status,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    //  Generate JWT using id + role
    const token = generateAccessToken({
      id: existingUser.id,
      role: existingUser.role as Role,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        phone: existingUser.phone,
        image: existingUser.image,
        dermatologistId: existingUser.dermatologistId,
        status: existingUser.status,
      },
      token,
    });
  } catch (error) {
    console.error("Login User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized, login again" });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
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
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};