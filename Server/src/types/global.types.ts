import { Role } from "./enum.types";

declare global {

  // =========================
  // Role-based access control
  // =========================
  const OnlyUser: Role[];
  const OnlySuperAdmin: Role[];
  const onlyAdmin: Role[];
  const AllAdmins: Role[];
  const ALLUserAndAdmins: Role[];

  // =========================
  // JWT Payload (Prisma + MySQL)
  // =========================
  interface IPayload {
    id: number;        // Prisma User ID (MySQL)
    email: string;
    firstname: string;
    lastname: string;
    role: Role;
  }

  interface IJwtPayload extends IPayload {
    iat: number;
    exp: number;
  }
}

export {};

