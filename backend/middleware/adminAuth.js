module.exports = (req, res, next) => {
  const token = req.headers["x-admin-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Admin token missing"
    });
  }

  // Simple validation (later you can improve)
  next();
};
