const mongoose = require("mongoose");

const UserMenuPermission = new mongoose.Schema(
  {
    role_id: { type: Number, required: true, index: true },
    menu_key: { type: Number, required: [true, "Menu Key Missing"] },
    action_id: { type: Number, required: [true, "Action ID Missing"] },
    status: { type: Number, default: 1 },
  },
  { collection: "usermenu_permissions", timestamps: true },
);

module.exports = mongoose.model("UserMenuPermission", UserMenuPermission);
