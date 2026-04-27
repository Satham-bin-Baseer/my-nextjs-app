const express = require("express");
const router = express.Router();
const menusController = require("../controller/menusController");

router.post("/list_menus", menusController.list_menus);
router.post("/add_menu", menusController.add_menu);
router.post("/delete_menu", menusController.delete_menu);

module.exports = router;
