const mongoose = require("mongoose");

const StockRequest = new mongoose.Schema(
  {
    item_id: { type: Number, required: true },
    quantity: { type: Number, required: [true, "Quantity Missing"] },
    order_id: { type: Number, required: true, index: true },
    status: { type: Number, default: 1 },
  },
  { collection: "stock_request", timestamps: true },
);

module.exports = mongoose.model("StockRequest", StockRequest);
