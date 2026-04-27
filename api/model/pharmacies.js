const mongoose = require("mongoose");

const Pharmacies = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    pharmacy_name: {
      type: String,
      required: [true, "Store Name Missing"],
      maxlength: 150,
    },
    area: {
      type: String,
      required: [true, "Area Name Missing"],
      maxlength: 150,
    },
    pharmacy_code: {
      type: Number,
      required: [true, "Store Code Missing"],
      unique: true,
    },
    opening_date: {
      type: String,
      required: [true, "Opening Date Missing"],
      minlength: [10, "Opening Date Minimum 10 characters needed"],
      maxlength: [10, "Opening Date Maximum 10 characters allowed"],
    },
    district: {
      type: String,
      required: [true, "District Missing"],
      maxlength: 30,
    },
    state: { type: String, required: [true, "State Missing"], maxlength: 30 },
    is_active: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
  },
  { collection: "pharmacies", timestamps: true },
);

module.exports = mongoose.model("Pharmacies", Pharmacies);
