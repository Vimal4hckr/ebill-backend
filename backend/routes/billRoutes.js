const express = require("express");
const router = express.Router();
const { createBill } = require("../controllers/billController");

// ONLY route → controller
router.post("/create", createBill);

module.exports = router;
