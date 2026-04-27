const express = require("express");
const router = express.Router();
const rolesController = require("../controller/rolesController");

router.post("/list_roles", rolesController.list_roles);
router.post("/add_role", rolesController.add_role);
router.post("/delete_role", rolesController.delete_role);
router.post("/update_role", rolesController.update_role);

module.exports = router;