const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware.js");
const {
  login,
  logout,
  refreshToken,
  register,
  userProfile,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/register-user", register);
router.post("/login-user", login);
router.post("/refresh", refreshToken);
router.post("/logout-user", authenticateToken, logout);
router.get("/user-profile", authenticateToken, userProfile);

module.exports = router;
