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

//Route to build management view
router.get("/management", utilities.handleErrors(invController.buildVehicleManage));

//Route to build Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Route to build Add Vehicle View
router.get("/add-vehcile", utilities.handleErrors(invController.buildAddVehicle))

console.log("inside routes/inventoryRoutes.js file")

//appends new routes to router object
module.exports = router;
