// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build individual inventory view by inv_id
router.get("/detail/:inv_id", invController.buildByInv_id);

console.log("inside routes/inventoryRoutes.js file")

//appends new routes to router object
module.exports = router;
