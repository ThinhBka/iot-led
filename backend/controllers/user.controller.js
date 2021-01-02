const User = require("../models/user.model");

module.exports.updateLed = function (req, res, next) {
  if (req.signedCookies.userId) {
    User.findOneAndUpdate({ _id: req.params.id }, { dataLed: req.body.dataLed })
      .then((user) => {
        res.status(200).json({
          success: true,
          led: user.dataLed,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else if (req.body.token) {
    User.findOneAndUpdate(
      { _id: req.body.token },
      { dataLed: req.body.dataLed }
    )
      .then((user) => {
        res.status(200).json({
          success: true,
          led: user.dataLed,
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
  if (req.signedCookies.userId) {
    try {
      const user = await User.find({ _id: req.params.id });
      res.json({
        user,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  } else if (req.body.token) {
    try {
      const user = await User.find({ _id: req.body.token });
      res.json({
        user,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  } else {
    res.status(200).json({
      success: false,
      redirectUrl: "/login",
    });
  }
};
