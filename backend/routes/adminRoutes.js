const express = require("express");
const router = express.Router();
const { db } = require("../firebase/firebaseAdmin");

// GET all bills (latest first)
router.get("/bills", async (req, res) => {
  try {
    const snapshot = await db
      .collection("bills")
      .orderBy("createdAt", "desc")
      .get();

    const bills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      count: bills.length,
      bills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
