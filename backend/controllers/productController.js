const { db } = require("../firebase/firebaseAdmin");

// =========================
// ADD PRODUCT
// =========================
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Product name and price are required" });
    }

    const productRef = await db.collection("products").add({
      name,
      price,
      category: category || "general",
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      productId: productRef.id
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// =========================
// GET ALL PRODUCTS
// =========================
exports.getProducts = async (req, res) => {
  try {
    const snapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
