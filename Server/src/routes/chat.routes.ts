import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChat, getChatMessages, getChats } from "../controllers/chat.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getChats);
router.get("/:chatId/messages", getChatMessages);
router.post("/", createChat);

export default router;