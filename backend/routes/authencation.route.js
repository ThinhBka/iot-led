const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authencation.controller");

router.post("/admin", AuthController.loginAdmin);

router.post("/user", AuthController.loginUser);

router.post("/create/user", AuthController.createUser);

router.post("/create/admin", AuthController.createAdmin);

router.get("/logout", (req, res, next) => {
  const cookie = req.signedCookies;
  for (const prop in cookie) {
    res.cookie(prop, "", { expires: new Date(0) });
  }
  res.status(200).json({
    success: true,
    redirectUrl: "/login",
  });
});

module.exports = router;
