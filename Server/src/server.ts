import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

/* =========================
   Middlewares
========================= */

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data (optional but safe)
app.use(express.urlencoded({ extended: true }));

/* =========================
   Health Check Route
========================= */

app.get("/", (_req, res) => {
  res.send("DermaCare API is running 🚀");
});

/* =========================
   Routes
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* =========================
   404 Handler
========================= */

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   Server Start
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
