import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await prisma.user.findUnique({
    where: { email },
  });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  res.status(201).json({
    accessToken: generateAccessToken({
      id: user.id,
      role: user.role,
    }),
    refreshToken: generateRefreshToken({
      id: user.id,
    }),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    accessToken: generateAccessToken({
      id: user.id,
      role: user.role,
    }),
    refreshToken: generateRefreshToken({
      id: user.id,
    }),
  });
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ message: "Logout successful" });
};
