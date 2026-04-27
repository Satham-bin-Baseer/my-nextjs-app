const mongoose = require("mongoose");

const Items = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    item_name: {
      type: String,
      required: [true, "Item Name Missing"],
      maxlength: [150, "Item Name Too Much Length"],
      unique: true,
    },
    item_type: {
      type: String,
      required: [true, "Item Type Missing"],
      maxlength: 25,
    },
    is_active: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
  },
  { collection: "items", timestamps: true },
);

module.exports = mongoose.model("Items", Items);
