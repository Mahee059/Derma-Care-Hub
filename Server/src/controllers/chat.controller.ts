import { Request, Response } from "express";
import { db } from "../lib/prisma";

interface AuthRequest extends Request {
  user?: any;
}

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    const chats = await db.chat.findMany({
      where:
        role === "DERMATOLOGISTS" ? { dermatologistId: userId } : { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        dermatologist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        OR: [{ userId }, { dermatologistId: userId }],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      res.status(404).json({
        success: false,
        message: "Chat not found",
      });
      return;
    }

    // Mark unread messages as read
    await db.message.updateMany({
      where: {
        chatId,
        senderId: {
          not: userId,
        },
        read: false,
      },
      data: {
        read: true,
      },
    });

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { dermatologistId } = req.body;

    // Check if chat already exists
    const existingChat = await db.chat.findFirst({
      where: {
        userId,
        dermatologistId,
      },
    });

    if (existingChat) {
      res.json({
        success: true,
        chatId: existingChat.id,
      });
      return;
    }

    const chat = await db.chat.create({
      data: {
        userId,
        dermatologistId,
      },
    });

    res.json({
      success: true,
      chatId: chat.id,
    });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
