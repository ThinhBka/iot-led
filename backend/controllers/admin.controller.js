const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const md5 = require("md5");

module.exports.updateUser = function (req, res, next) {
  if (req.signedCookies.adminId) {
    User.findByIdAndUpdate({ _id: req.body.idUser }, { $set: req.body })
      .then((user) => {
        res.status(200).send("Done update user");
      })

      .catch((err) => {
        next(err);
      });
  } else if (req.body.token) {
    User.findByIdAndUpdate({ _id: req.body.idUser }, { $set: req.body })
      .then((user) => {
        res.status(200).send("Done update user");
      })

      .catch((err) => {
        next(err);
      });
  } else {
    res.status(200).json({
      success: false,
      redirectUrl: "/login",
    });
  }
};

module.exports.createUser = function (req, res, next) {
  if (req.signedCookies.adminId) {
    new User({
      email: req.body.email,
      password: req.body.password,
      dataLed: req.body.dataLed,
      adminId: req.signedCookies.adminId,
    })
      .save()
      .then((user) => {
        res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else if (req.body.token) {
    new User({
      email: req.body.email,
      password: req.body.password,
      dataLed: req.body.dataLed,
      adminId: req.body.token,
    })
      .save()
      .then((user) => {
        res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(200).json({
      success: false,
      redirectUrl: "/login",
    });
  }
};

module.exports.findUser = async function (req, res, next) {
  try {
    if (req.signedCookies.adminId) {
      const users = await User.find({ adminId: req.signedCookies.adminId });
      res.status(200).json({
        success: true,
        users,
      });
    } else if (req.body.token) {
      const users = await User.find({ adminId: req.body.token });
      res.status(200).json({
        success: true,
        users,
      });
    } else {
      res.status(200).json({
        success: false,
        redirectUrl: "/login",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async function (req, res, next) {
  try {
    if (req.signedCookies.adminId) {
      await User.findByIdAndDelete({ _id: req.body.idUser });
      res.status(200).send("Delete user");
    } else if (req.body.token) {
      await User.findByIdAndDelete({ _id: req.body.idUser });
      res.status(200).send("Delete user");
    } else {
      res.status(200).json({
        success: false,
        redirectUrl: "/login",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.searchUser = async function (req, res, next) {
  try {
    if (req.signedCookies.adminId) {
      const query = req.query.q;
      const data = await User.find({ adminId: req.signedCookies.adminId });
      const matchedUsers = data.filter(function (user) {
        return user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      res.status(200).json({
        user: matchedUsers,
        redirectUrl: "/admin",
      });
    } else if (req.body.token) {
      const query = req.query.q;
      const data = await User.find({ adminId: req.body.token });
      const matchedUsers = data.filter(function (user) {
        return user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      res.status(200).json({
        user: matchedUsers,
        redirectUrl: "/admin",
      });
    } else {
      res.status(200).json({
        success: false,
        redirectUrl: "/login",
      });
    }
  } catch (error) {
    next(error);
  }
};
