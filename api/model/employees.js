const mongoose = require("mongoose");

const Employees = new mongoose.Schema(
  {
    _id: { type: Number, required: true, index: true },
    emp_name: {
      type: String,
      required: [true, "Staff Name Missing"],
      maxlength: 100,
    },
    emp_dob: {
      type: String,
      required: [true, "DOB Missing"],
      minlength: [10, "DOB Minimum 10 characters needed"],
      maxlength: [10, "DOB Maximum 10 characters allowed"],
    },
    emp_gender: {
      type: String,
      required: [true, "Gender Missing"],
      enum: {
        values: ["male", "female"],
        message: "Gender: only Male or Female",
      },
      maxlength: 10,
    },
    emp_contact: {
      type: String,
      required: [true, "Contact Number Missing"],
      minlength: [10, "Contact No Minimum 10 characters needed"],
      maxlength: [10, "Contact No Maximum 10 characters allowed"],
      unique: true,
    },
    emp_join_date: {
      type: String,
      required: [true, "Joining Date Missing"],
      minlength: [10, "Joining Date Minimum 10 characters needed"],
      maxlength: [10, "Joining Date Maximum 10 characters allowed"],
    },
    emp_role: { type: Number, required: [true, "Staff Designation Missing"] },
    emp_pharmacy: { type: Number },
    emp_mobile_password: { type: String, required: true, maxlength: 300 },
    is_active: { type: Boolean, default: true },
    status: { type: Number, default: 1 },
  },
  { collection: "employees", timestamps: true },
);

module.exports = mongoose.model("Employees", Employees);
