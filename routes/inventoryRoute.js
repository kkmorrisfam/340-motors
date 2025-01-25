// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual inventory view by inv_id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInv_id));

// Route to build test data -> throws 500 error
router.get("/error/:inv_id", utilities.handleErrors(invController.findServerError));

console.log("inside routes/inventoryRoutes.js file")

//appends new routes to router object
module.exports = router;
