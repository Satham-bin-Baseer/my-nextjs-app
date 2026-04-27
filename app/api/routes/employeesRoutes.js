const express = require("express");
const router = express.Router();
const employeesController = require("../controller/employeesController.js");

router.post("/list_employees", employeesController.list_employees);
router.post("/add_employee", employeesController.add_employee);
router.post("/delete_employee", employeesController.delete_employee);
router.post("/update_employee", employeesController.update_employee);

module.exports = router;
