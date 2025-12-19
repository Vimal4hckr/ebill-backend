const express = require("express");
const router = express.Router();
const { db } = require("../firebase/firebaseAdmin");
const { sendWhatsAppTemplateMessage } = require("../utils/whatsapp");

// QR verification endpoint
// URL: /api/verify/:billId
router.get("/:billId", async (req, res) => {
  try {
    const { billId } = req.params;

    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).send("❌ Invalid Bill");
    }

    const billData = billSnap.data();

    // Prevent double verification
    if (billData.verified) {
      return res.send("⚠️ Bill already verified");
    }

    // Mark bill as verified
    await billRef.update({
      verified: true,
      verifiedAt: new Date()
    });

    // Send Thank You WhatsApp message
    await sendWhatsAppTemplateMessage(
      billData.phone,
      "ebill_verified_thankyou_v1",
      [
        billData.customerName,
        billId
      ]
    );

    // Simple response for scanner
    res.send("✅ Bill verified successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
