import { Request, Response } from "express";
import { db } from "../lib/prisma";
import { NotificationType } from "@prisma/client";

interface AuthRequest extends Request {
  user?: any;
}

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await db.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      });
      return;
    }

    await db.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await db.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      });
      return;
    }

    await db.notification.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Utility function to create notifications
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string
) => {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });
  } catch (error) {
    console.error("Create notification error:", error);
  }
};

export const getUnreadNotificationsCount = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const count = await db.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get unread notifications count error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
