router.post("/login", (req, res) => {
  const { pin } = req.body;

  if (pin !== process.env.ADMIN_PIN) {
    return res.status(401).json({
      success: false,
      error: "Invalid PIN"
    });
  }

  const token = Buffer.from("admin").toString("base64");

  res.json({
    success: true,
    token
  });
});
