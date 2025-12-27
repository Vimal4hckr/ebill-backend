const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// =========================
// 1️⃣ LOAD SERVICE ACCOUNT
// =========================
let serviceAccount;

// 🔹 For Render / Production (recommended)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}
// 🔹 For Local Development
else {
  const serviceKeyPath = path.join(__dirname, "..", "serviceAccountKey.json");

  if (!fs.existsSync(serviceKeyPath)) {
    throw new Error("❌ serviceAccountKey.json not found");
  }

  serviceAccount = require(serviceKeyPath);
}

// =========================
// 2️⃣ INITIALIZE FIREBASE (ONLY ONCE)
// =========================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// =========================
// 3️⃣ FIRESTORE INSTANCE
// =========================
const db = admin.firestore();

// =========================
// 4️⃣ EXPORTS
// =========================
module.exports = { admin, db };
