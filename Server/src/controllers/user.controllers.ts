import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(user);
};
