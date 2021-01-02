const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");

router.post("/create/user", AdminController.createUser);

router.put("/update/user", AdminController.updateUser)

router.get("/", AdminController.findUser);

router.post("/delete/user", AdminController.deleteUser)

router.get("/search", AdminController.searchUser)

module.exports = router;
