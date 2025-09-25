import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Routes
import authRoute from "./routes/authRoutes.js";

configDotenv();

const app = express();
const PORT = process.env.PORT;

// Security Middlewares
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "developement"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.all("/{*any}", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// app listener
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT} `);
});
