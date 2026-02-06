import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../lib/prisma";
import { Role } from "../types/enum.types";


const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

/**
 * Register User / Dermatologist
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check required fields
    if (!email || !phone || !password) {
      res.status(400).json({
        success: false,
        message: "Email, phone and password are required",
      });
      return;
    }

    // Check email
    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    // Check phone
    const existingPhone = await db.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
