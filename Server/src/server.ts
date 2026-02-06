import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import skinProfileRoutes from "./routes/skinProfile.routes";
import productRoutes from "./routes/product.routes";
import appointmentRoutes from "./routes/appointment.routes";
import notificationsRoutes from "./routes/notification.routes";
import dermotologistRoutes from "./routes/dermotologist.routes";
import progressRoutes from "./routes/dermotologist.routes";
import routineRoutes from "./routes/routine.routes";
import chatRoutes from "./routes/chat.routes";
import AIRoutes from "./routes/AI.routes"





dotenv.config();

const app = express();

//Middlewares 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (_req, res) => {
  res.send("DermaCare API is running 🚀");
});


// Routes
app.use("/api/auth", authRoutes); // ✅ authRoutes now defined
app.use("/api/users", userRoutes);
app.use("/api/skinProfile", skinProfileRoutes)
app.use("api/product", productRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/notification", notificationsRoutes);
app.use("/api/dermotologist", dermotologistRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/routine", routineRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/AI", AIRoutes) 



// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
 

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
