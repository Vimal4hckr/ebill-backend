const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceKeyPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!fs.existsSync(serviceKeyPath)) {
  throw new Error("Service account key missing!");
}

const serviceAccount = require(serviceKeyPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
