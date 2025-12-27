const { db } = require("../firebase/firebaseAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER USER
// =========================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const userRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      userId: userRef.id,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// =========================
// LOGIN USER
// =========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      {
        userId: userDoc.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: userDoc.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// =========================
// GET LOGGED-IN USER
// =========================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDoc.data();
    delete user.password;

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
