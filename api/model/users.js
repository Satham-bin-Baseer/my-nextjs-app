const mongoose = require("mongoose");

const Users = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username Missing"],
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Missing"],
      maxlength: 250,
    },
    emp_id: { type: Number, required: [true, "Staff Name Missing"] },
    is_active: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
  },
  { collection: "users", timestamps: true },
);

module.exports = mongoose.model("Users", Users);
