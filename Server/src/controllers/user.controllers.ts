import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

export const getProfile = async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.json(user);
};
