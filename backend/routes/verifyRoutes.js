const express = require("express");
const router = express.Router();
const { db } = require("../firebase/firebaseAdmin");

// 🔍 GET bill details
router.get("/:billId", async (req, res) => {
  try {
    const billId = req.params.billId;
    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }

    res.json({
      success: true,
      data: billSnap.data()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ VERIFY BILL (DOUBLE LOCK)
router.post("/:billId/confirm", async (req, res) => {
  try {
    const billId = req.params.billId;
    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }

    const billData = billSnap.data();

    // 🔒 PREVENT DOUBLE VERIFY
    if (billData.status === "verified") {
      return res.status(400).json({
        success: false,
        error: "Bill already verified"
      });
    }

    await billRef.update({
      status: "verified",
      verifiedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: "Bill verified successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
