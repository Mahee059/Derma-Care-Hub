import { Request, Response } from "express";
import { db } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { sendRegistrationConfirmationEmail } from "../config/email";
import generateToken from "../utils/jwt";


interface AuthRequest extends Request {
  user?: any;
}

//register user controller
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, dermatologistId } = req.body;

  if (!name || !email || !password || !role || !phone) {
    res.status(400).json({ success: false, message: "Missing details" });
    return;
  }

  // If registering as dermatologist, dermatologist ID is required
  if (role === "DERMATOLOGISTS" && !dermatologistId) {
    res.status(400).json({
      success: false,
      message: "Dermatologist ID is required for dermatologist registration",
    });
    return;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    //check if there is any existing user
    if (existingUser) {
      res.status(401).json({ success: false, message: "user already exists" });
      return;
    }

    //check existing phonenumber
    const existingNumber = await db.user.findUnique({
      where: { phone },
    });

    if (existingNumber) {
      res
        .status(401)
        .json({ success: false, message: "phone number already exists" });
      return;
    }

    // Check if dermatologist ID already exists
    if (dermatologistId) {
      const existingDermId = await db.user.findUnique({
        where: { dermatologistId },
      });

      if (existingDermId) {
        res.status(401).json({
          success: false,
          message: "Dermatologist ID already exists",
        });
        return;
      }
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //validate roles
    const allowedRoles = ["USER", "DERMATOLOGISTS", "ADMIN"];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role" });
      return;
    }

    //create userdata
    const userData: Prisma.UserCreateInput = {
      email,
      password: hashPassword,
      role,
      name,
      phone,
      ...(dermatologistId && { dermatologistId }),
      status: role === "DERMATOLOGISTS" ? "PENDING" : "APPROVED",
    };

    const createdUser = await db.user.create({
      data: userData,
    });

    // If dermatologist, notify admin and don't provide token
    if (role === "DERMATOLOGISTS") {
      await sendRegistrationConfirmationEmail(
        createdUser.email,
        createdUser.name,
        dermatologistId
      );

      // Create notification for admin
      const admins = await db.user.findMany({
        where: { role: "ADMIN" },
      });

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

      res.status(201).json({
        success: true,
        message:
          "Registration submitted successfully. Please check your email for confirmation and wait for admin approval.",
        requiresApproval: true,
      });
      return;
    }

    const token = generateToken(createdUser.id);

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
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//login user controller
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Missing details" });
    return;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    //throw error if user doesn't exists
    if (!existingUser) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Check if dermatologist is approved
    if (
      existingUser.role === "DERMATOLOGISTS" &&
      existingUser.status !== "APPROVED"
    ) {
      let message = "Your account is pending approval.";
      if (existingUser.status === "REJECTED") {
        message = "Your account has been rejected. Please contact support.";
      }
      res.status(401).json({
        success: false,
        message,
        status: existingUser.status,
      });
      return;
    }

    //check if password matches
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(existingUser.id);

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
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized, login again" });
    return;
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
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
