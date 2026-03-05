import express from "express";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http"
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import skinProfileRoutes from "./routes/skinProfile.routes";
import productRoutes from "./routes/product.routes";
import appointmentRoutes from "./routes/appointment.routes";
import notificationsRoutes from "./routes/notification.routes";
import dermatologistRoutes from "./routes/dermatologist.routes";
import progressRoutes from "./routes/progress.routes";
import routineRoutes from "./routes/routine.routes";
import chatRoutes from "./routes/chat.routes";
import AIRoutes from "./routes/AI.routes";
import adminRoutes from "./routes/admin.routes";
import { setupSocketHandlers } from "./socket/socket.handler";
import cookieParser from "cookie-parser";



// Initialize express
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});




// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (_req, res) => {
  res.send("DermaCare API is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skin-profile", skinProfileRoutes); 
app.use("/api/product", productRoutes); 
app.use("/api/appointment", appointmentRoutes);
app.use("/api/notification", notificationsRoutes);
app.use("/api/dermatologist", dermatologistRoutes);
app.use("/api/progress", progressRoutes); 
app.use("/api/routine", routineRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/AI", AIRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// Setup socket handlers
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
