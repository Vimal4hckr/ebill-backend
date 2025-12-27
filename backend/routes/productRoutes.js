const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  addProduct,
  getProducts,
} = require("../controllers/productController");

// =========================
// PRODUCT ROUTES
// =========================

// Add new product (protected)
router.post("/add", auth, addProduct);

// Get all products (public or protected – your choice)
router.get("/all", getProducts);

module.exports = router;
