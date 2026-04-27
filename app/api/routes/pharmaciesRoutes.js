const express = require("express");
const router = express.Router();
const pharmaciesController = require("../controller/pharmaciesController");

router.post("/list_pharmacies", pharmaciesController.list_pharmacies);
router.post("/add_pharmacy", pharmaciesController.add_pharmacy);
router.post("/delete_pharmacy", pharmaciesController.delete_pharmacy);
router.post("/update_pharmacy", pharmaciesController.update_pharmacy);

module.exports = router;