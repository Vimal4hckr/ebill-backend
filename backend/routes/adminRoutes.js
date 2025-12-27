const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  getAllBills,
  getDashboardStats,
} = require("../controllers/adminController");

// =========================
// ADMIN ROUTES (PROTECTED)
// =========================

// Get all bills
router.get("/bills", auth, getAllBills);

// Dashboard statistics
router.get("/stats", auth, getDashboardStats);

module.exports = router;
