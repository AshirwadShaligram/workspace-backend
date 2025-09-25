import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  login,
  logout,
  refreshToken,
  register,
  userProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-user", register);
router.post("/login-user", login);
router.post("/refresh", refreshToken);
router.post("/logout-user", authenticateToken, logout);
router.get("/user-profile", authenticateToken, userProfile);

export default router;
