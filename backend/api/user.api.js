const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.get("/", async (req, res, next) => {
  const data = await User.find();
  res.json(data);
});

module.exports = router;
