const express = require("express");
const router = express.Router();
const Admin = require("../models/admin.model");

router.get("/", async (req, res, next) => {
  const data = await Admin.find();
  res.json(data);
});

module.exports = router;
