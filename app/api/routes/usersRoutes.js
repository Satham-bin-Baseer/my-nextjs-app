const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");

router.post("/list_users", usersController.list_users);
router.post("/add_user", usersController.add_user);
router.post("/delete_user", usersController.delete_user);
router.post("/update_user", usersController.update_user);

module.exports = router;