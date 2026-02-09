import { Server, Socket } from "socket.io";
import { db } from "../lib/prisma";
import jwt from "jsonwebtoken";

interface AuthSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use(async (socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log("User connected:", socket.userId);

    // Join user's room for private messages
    socket.join(socket.userId!);

    socket.on(
      "send_message",
      async (data: { chatId: string; content: string }) => {
        try {
          const { chatId, content } = data;

          const message = await db.message.create({
            data: {
              chatId,
              senderId: socket.userId!,
              content,
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
          });

          // Update chat's updatedAt
          await db.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
          });

          const chat = await db.chat.findUnique({
            where: { id: chatId },
            select: { userId: true, dermatologistId: true },
          });

          if (chat) {
            // Send to the other participant
            const recipientId =
              socket.userId === chat.userId
                ? chat.dermatologistId
                : chat.userId;

            io.to(recipientId).emit("receive_message", message);
          }
        } catch (error) {
          console.error("Send message error:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
};
