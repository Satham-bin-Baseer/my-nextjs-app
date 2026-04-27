const mongoose = require("mongoose");

const Menus = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    menuname_key: {
      type: String,
      required: [true, "Menu Key Missing"],
      maxlength: 150,
      unique: true,
    },
    status: { type: Number, default: 1 },
  },
  { collection: "user_menus", timestamps: true },
);

module.exports = mongoose.model("Menus", Menus);
