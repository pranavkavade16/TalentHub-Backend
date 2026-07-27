import express from "express";
import cors from "cors";
import { initializeDatabase } from "./config/db.config.js";
import authRoutes from "./modules/auth/auth.routes.js";

import { errorHandler } from "./shared/middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Parse JSON request body
app.use(express.json());
initializeDatabase();

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

/* -------------------------------- Routes -------------------------------- */

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
