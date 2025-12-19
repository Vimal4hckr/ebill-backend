const { db } = require("../firebase/firebaseAdmin");
const QRCode = require("qrcode");

const makeBillUrl = (billId) => {
  return `http://localhost:5173/verify.html?billId=${billId}`;
};

exports.createBill = async (req, res) => {
  try {
    const { customerName, customerPhone, items, totalAmount } = req.body;

    if (!customerName || !customerPhone || !items || !totalAmount) {
      return res.status(400).json({ error: "Invalid bill data" });
    }

    const billData = {
      customerName,
      customerPhone,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // ✅ THIS WILL NOW WORK
    const billRef = await db.collection("bills").add(billData);
    const billId = billRef.id;

    const billUrl = makeBillUrl(billId);
    const qrCode = await QRCode.toDataURL(billUrl);

    await billRef.update({ billUrl, qrCode });

    res.status(200).json({
      success: true,
      billId,
      qrCode,
    });
  } catch (error) {
    console.error("BILL ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
