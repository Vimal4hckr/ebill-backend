exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (username === "As-kitchen" && password === "9941986649") {
    return res.json({
      success: true,
      token: "admin-jwt-token"
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};
