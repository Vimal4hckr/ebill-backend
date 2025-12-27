const express = require("express");
const router = express.Router();

// Controller
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

// Middleware (JWT / Firebase auth check)
const authMiddleware = require("../middleware/authMiddleware");

// =========================
// AUTH ROUTES
// =========================

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user profile
router.get("/me", authMiddleware, getProfile);

// =========================
// EXPORT ROUTER
// =========================
module.exports = router;
