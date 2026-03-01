import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AccessTokenPayload {
  id: string;   
  role: Role;
}

export const generateAccessToken = (
  payload: AccessTokenPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (
  token: string
): AccessTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
};