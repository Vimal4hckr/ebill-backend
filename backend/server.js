require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 BILL ROUTES
app.use("/api/bill", require("./routes/billRoutes"));

// 🔹 👉 PASTE THIS LINE (VERIFY ROUTES) ← HERE
app.use("/api/verify", require("./routes/verifyRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

// 🔹 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
