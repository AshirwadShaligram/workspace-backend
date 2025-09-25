const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const http = require("http");

// Routes
const authRoute = require("./routes/authRoutes.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const server = http.createServer(app);
const io = socketIo(server);

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
app.set("io", io);

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
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.all("/{*any}", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// app listener
server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT} `);
});
