const express = require("express");
const router = express.Router();

const employeesRoutes = require("../routes/employeesRoutes");
const usersRoutes = require("../routes/usersRoutes");
const rolesRoutes = require("../routes/rolesRoutes");
const menusRoutes = require("../routes/menusRoutes");
const pharmaciesRoutes = require("../routes/pharmaciesRoutes");
const itemsRoutes = require("../routes/itemsRoutes");
const ordersRoutes = require("../routes/ordersRoutes");

router.use("/api/employees", employeesRoutes);
router.use("/api/users", usersRoutes);
router.use("/api/roles", rolesRoutes);
router.use("/api/user-menus", menusRoutes);
router.use("/api/pharmacies", pharmaciesRoutes);
router.use("/api/items", itemsRoutes);
router.use("/api/orders", ordersRoutes);

module.exports = router;
