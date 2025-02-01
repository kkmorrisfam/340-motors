// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

console.log("Inventory routes loaded");


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

router.post('/add-classification', (req, res, next) => {
    console.log("POST /add-classification route triggered");
    next();
});

console.log("Testing function call:");
console.log(utilities.newClassificationRules());

//Route to post classification form data
router.post(
    //the path being watched
    '/add-classification',     
    utilities.newClassificationRules(),
    utilities.checkClassificationData,    
    utilities.handleErrors(invController.processNewClassification))


console.log("inside routes/inventoryRoutes.js file")

//appends new routes to router object
module.exports = router;
