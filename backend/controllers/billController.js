const { db } = require("../firebase/firebaseAdmin");
const QRCode = require("qrcode");
const { sendSMS } = require("../utils/sms"); // ✅ ADD THIS

// =========================
// CREATE BILL (ADMIN SIDE)
// =========================
exports.createBill = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
      totalAmount
    } = req.body;

    // ✅ Basic validation
    if (
      !customerName ||
      !customerPhone ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    // 1️⃣ Create bill in Firestore
    const billRef = await db.collection("bills").add({
      customerName,
      customerPhone: String(customerPhone), // always store as string
      items,
      totalAmount,
      verified: false,
      createdAt: new Date()
    });

    const billId = billRef.id;

    // 2️⃣ QR should open FRONTEND verify page
    const billUrl = `${process.env.APP_URL}/verify/${billId}`;

    // 3️⃣ Generate QR Code
    const qrCode = await QRCode.toDataURL(billUrl);

    // 4️⃣ Update bill with QR + URL
    await billRef.update({
      billUrl,
      qrCode
    });

    // 5️⃣ SEND SMS TO CUSTOMER 📩
    try {
      const smsMessage =
        `Hello ${customerName}, your bill of ₹${totalAmount} is generated.\n` +
        `Verify here: ${billUrl}`;

      await sendSMS(String(customerPhone), smsMessage);
    } catch (smsError) {
      // ❗ SMS failure should NOT break bill creation
      console.error(
        "SMS Failed:",
        smsError.response?.data || smsError.message
      );
    }

    // 6️⃣ Send response
    res.status(201).json({
      success: true,
      billId,
      billUrl,
      qrCode
    });

  } catch (error) {
    console.error("Create Bill Error:", error);
    res.status(500).json({ error: "Failed to create bill" });
  }
};

// =========================
// VERIFY BILL (SCAN SIDE)
// =========================
exports.verifyBill = async (req, res) => {
  try {
    const { billId } = req.params;

    if (!billId) {
      return res.status(400).json({ error: "Bill ID is required" });
    }

    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const billData = billSnap.data();

    // 1️⃣ Mark as verified only once
    if (!billData.verified) {
      await billRef.update({
        verified: true,
        verifiedAt: new Date()
      });
    }

    // 2️⃣ Send bill details
    res.json({
      success: true,
      bill: {
        id: billId,
        ...billData,
        verified: true
      }
    });

  } catch (error) {
    console.error("Verify Bill Error:", error);
    res.status(500).json({ error: "Bill verification failed" });
  }
};
