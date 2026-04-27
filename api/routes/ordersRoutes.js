const express = require("express");
const router = express.Router();
const ordersController = require("../controller/ordersController");

router.post("/list_orders", ordersController.list_orders);
router.post("/create_order", ordersController.create_order);
router.post("/delete_order", ordersController.delete_order);

router.post(
  "/list_orders_by_order_id",
  ordersController.list_orders_by_order_id,
);
router.post(
  "/delete_order_by_order_id",
  ordersController.delete_order_by_order_id,
);
router.post(
  "/update_orders_by_order_ids",
  ordersController.update_orders_by_order_ids,
);

module.exports = router;
