const express = require("express");
const router = express.Router();
const itemsController = require("../controller/itemsController");

router.post("/list_items", itemsController.list_items);
router.post("/add_item", itemsController.add_item);
router.post("/delete_item", itemsController.delete_item);
router.post("/update_item", itemsController.update_item);

module.exports = router;