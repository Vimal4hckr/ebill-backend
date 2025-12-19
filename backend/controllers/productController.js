const db = require("../firebase/firebaseAdmin");

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    // Validation
    if (!data.name || !data.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    data.createdAt = new Date();

    await db.collection("products").add(data);

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();

    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
