import { Role } from "./enum.types";

declare global {

  
  const OnlyUser: Role[];
  const OnlySuperAdmin: Role[];
  const onlyAdmin: Role[];
  const AllAdmins: Role[];
  const ALLUserAndAdmins: Role[];

 export interface IPayload {
    id: number;        
    email: string;
    firstname: string;
    lastname: string;
    role: Role;
  }

  export interface IJwtPayload extends IPayload {
    iat: number;
    exp: number;
  }
}

export {};

