const QRCode = require("qrcode");

exports.generateQR = async (billId) => {
  try {
    const verifyUrl = `${process.env.APP_URL}/api/verify/${billId}`;
    return await QRCode.toDataURL(verifyUrl);
  } catch (err) {
    throw new Error("QR generation failed: " + err.message);
  }
};
