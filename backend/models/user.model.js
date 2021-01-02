const mongoose = require("mongoose");

// Tạo một model mới
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dataLed: {
    type: Array,
  },
  adminId: {
    type: String
  }
});

module.exports = mongoose.model("users", userSchema);
