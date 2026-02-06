import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { deleteNotification, getNotifications, getUnreadNotificationsCount, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notification.controller";



const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead);
router.delete("/:id", deleteNotification);
router.get("/unread-count", getUnreadNotificationsCount);

export default router;
