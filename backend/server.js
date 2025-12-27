// =========================
// 1️⃣ BASIC SETUP
// =========================
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =========================
// 2️⃣ MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// 3️⃣ FIREBASE INITIALIZATION
// =========================
require("./firebase/firebaseAdmin");

// =========================
// 4️⃣ ROUTES (FIXED)
// =========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/bill", require("./routes/billRoutes")); // ✅ FIXED (singular)
app.use("/api/products", require("./routes/productRoutes"));

// ❌ REMOVE verifyRoutes (already handled in billRoutes)

// =========================
// 5️⃣ HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send("✅ Food E-Bill Backend is Running");
});

// =========================
// 6️⃣ ERROR HANDLING
// =========================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// =========================
// 7️⃣ START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
