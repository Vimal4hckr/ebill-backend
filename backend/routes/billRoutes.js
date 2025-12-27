const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createBill,
  verifyBill
} = require("../controllers/billController");

// =========================
// ADMIN SIDE (PROTECTED)
// =========================
// Create bill → requires login
router.post("/create", auth, createBill);

// =========================
// SCAN SIDE (PUBLIC)
// =========================
// Verify bill → NO auth (QR scan)
router.get("/verify/:billId", verifyBill);

module.exports = router;
