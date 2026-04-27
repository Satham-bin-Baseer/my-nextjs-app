const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

router.post("/login", authController.perform_user_login);
router.post("/google-login", authController.perform_google_login);
router.post("/list_user_permissions", authController.list_user_permissions);
router.post("/update_user_permissions", authController.update_user_permissions);

module.exports = router;
