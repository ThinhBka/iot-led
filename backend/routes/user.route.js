const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/:id", UserController.updateLed);

router.get("/:id", UserController.findUser);

module.exports = router;
