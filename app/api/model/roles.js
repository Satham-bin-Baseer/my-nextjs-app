const mongoose = require("mongoose");

const Roles = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    role_name: {
      type: String,
      required: [true, "Designation Name Missing"],
      maxlength: 110,
      unique: true,
    },
    status: { type: Number, default: 1 },
  },
  { collection: "roles", timestamps: true },
);

module.exports = mongoose.model("Roles", Roles);
