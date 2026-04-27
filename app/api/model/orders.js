const mongoose = require("mongoose");

const Orders = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    pharmacy_id: { type: Number, required: true, index: true },
    pharmacy_code: { type: Number, required: true },
    ordered_date: {
      type: String,
      required: [true, "Order Date Missing"],
      maxlength: 19,
    },
    emp_id: { type: Number, required: true },
    editable: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
  },
  { collection: "orders", timestamps: true },
);

module.exports = mongoose.model("Orders", Orders);
