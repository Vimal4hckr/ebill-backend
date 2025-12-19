const db = require("../firebase/firebaseAdmin");
const { sendWhatsAppTemplateMessage } = require("../utils/whatsapp");

exports.confirmBill = async (req, res) => {
  try {
    const { billId } = req.params;

    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).json({ success: false, error: "Bill not found" });
    }

    const bill = billSnap.data();

    if (bill.status === "verified") {
      return res.json({ success: true, message: "Already verified" });
    }

    // ✅ Update Firestore
    await billRef.update({
      status: "verified",
      verifiedAt: new Date().toISOString()
    });

    // ✅ Send WhatsApp message
    await sendWhatsAppTemplateMessage({
      to: bill.customerPhone,
      templateName: "bill_verified",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: bill.customerName },
            { type: "text", text: billId }
          ]
        }
      ]
    });

    res.json({ success: true, message: "Bill verified & WhatsApp sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
