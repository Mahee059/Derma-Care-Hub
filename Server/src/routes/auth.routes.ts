import { Router, Request, Response } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

console.log("✅ Auth routes loaded");

// REGISTER route
router.post("/register", (req: Request, res: Response) => {
  console.log("➡️ /register route hit");
  console.log("Body:", req.body);
  return register(req, res);
});

// LOGIN route
router.post("/login", (req: Request, res: Response) => {
  console.log("➡️ /login route hit");
  console.log("Body:", req.body);
  return login(req, res);
});

export default router;
