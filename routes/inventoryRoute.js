// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inv-controller");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;