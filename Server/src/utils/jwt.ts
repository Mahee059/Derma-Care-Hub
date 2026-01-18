import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export interface AccessTokenPayload {
  id: number;
  role: Role;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: { id: number }) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
