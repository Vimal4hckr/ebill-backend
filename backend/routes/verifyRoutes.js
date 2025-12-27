const express = require("express");
const router = express.Router();

const { verifyBill } = require("../controllers/billController");

// =========================
// VERIFY BILL (QR SCAN)
// =========================
router.get("/:billId", verifyBill);

module.exports = router;
