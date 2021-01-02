const mongoose = require("mongoose");

// Tạo một model mới
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dataUser: {
    type: Array,
  },
  data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
});

module.exports = mongoose.model("admins", adminSchema);
