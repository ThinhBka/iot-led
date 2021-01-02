const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const md5 = require("md5");

module.exports.loginUser = function (req, res, next) {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length !== 0) {
        if (user[0].password === req.body.password) {
          res.cookie('userId', user[0].id, { expires: new Date(Date.now() + 900000), signed: true })
          res.status(200).json({
            success: true,
            redirectUrl: "/user/" + user[0].id,
            userId: user[0].id
          });
        } else {
          res.status(404).send("Password wrong, pls check !!!");
        }
      } else {
        res.status(404).send("Account not exits");
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.loginAdmin = function (req, res, next) {
  Admin.find({ email: req.body.email })
    .then((admin) => {
      if (admin.length !== 0) {
        if (admin[0].password === md5(req.body.password)) {
          res.cookie('adminId', admin[0].id, { expires: new Date(Date.now() + 900000), signed: true })
          res.status(200).json({
            success: true,
            redirectUrl: "/admin",
            adminId: admin[0].id
          });
        } else {
          res.status(404).send("Password wrong, pls check !!!");
        }
      } else {
        res.status(404).send("Account not exits");
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = function (req, res, next) {
  User.find({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (user.length === 0) {
        new User({
          email: req.body.email,
          password: md5(req.body.password),
          dataLed: req.body.dataLed,
        })
          .save()
          .then(() => res.status(200).send("Done save user"));
      } else {
        res.status(200).send("User exits");
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createAdmin = function (req, res, next) {
  Admin.find({ email: req.body.email })
    .then((admin) => {
      console.log(admin);
      if (admin.length === 0) {
        new Admin({
          email: req.body.email,
          password: md5(req.body.password),
          dataUser: req.body.dataUser,
        })
          .save()
          .then(() => res.status(200).send("Done save admin"));
      }
      res.status(200).send("Admin exits");
    })
    .catch((err) => {
      next(err);
    });
};
