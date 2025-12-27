const { db } = require("../firebase/firebaseAdmin");

// =========================
// GET ALL BILLS (ADMIN)
// =========================
exports.getAllBills = async (req, res) => {
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
      bills
    });
  } catch (error) {
    console.error("Get All Bills Error:", error);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

// =========================
// DASHBOARD STATS (ADMIN)
// =========================
exports.getDashboardStats = async (req, res) => {
  try {
    const snapshot = await db.collection("bills").get();

    let totalBills = 0;
    let verifiedBills = 0;
    let totalAmount = 0;

    snapshot.forEach(doc => {
      const bill = doc.data();
      totalBills++;
      if (bill.verified) verifiedBills++;
      totalAmount += bill.totalAmount || 0;
    });

    res.json({
      success: true,
      stats: {
        totalBills,
        verifiedBills,
        pendingBills: totalBills - verifiedBills,
        totalAmount
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
