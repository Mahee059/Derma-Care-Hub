import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

// GET ALL USERS (ADMIN)
export const getUsers = async (req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
    },
  });
  res.json(users);
};

// GET USER BY ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE USER
export const updateUser = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  await prisma.user.update({ where: { id }, data: req.body });
  res.json({ message: "User updated" });
};

// DELETE USER
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted" });
};
