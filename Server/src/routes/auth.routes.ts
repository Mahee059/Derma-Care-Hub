import { Router, Request, Response } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

console.log("Auth routes loaded");
// REGISTER route
router.post("/register", register);

// LOGIN route
router.post("/login", login);

export default router;
