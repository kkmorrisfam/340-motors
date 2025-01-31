const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *************************
*  Build inventory by classification view
*  *************************/
invCont.buildByClassificationId = async function (req, res, next) {
    // console.log("req in buildByClassificaitonId", req)
    console.log("inside controllers/invController.js file invCont.buildByClassificationId function")
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

/* *************************
*  Build inventory by specific inventory view
*  *************************/
invCont.buildByInv_id = async function (req, res, next) {
    console.log("inside controllers/invController.js file invCont.buildByInv_id function");
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInv_id(inv_id);
    // console.log("data in buildByInv_id: ", data);
    const vehicleView = await utilities.buildVehicleView(data);
    let nav = await utilities.getNav();
    const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    res.render("./inventory/vehicle", {
        title: vehicleName,
        nav,
        vehicleView,
    })
}

/* ***************************
 * Deliver Management View 
 ****************************/

invCont.buildVehicleManage =  async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
       title: "Vehicle Management",
       nav, 
       //need this.  EJS view could throw an error because "errors" variable is expected and not found
       errors: null,
    })
}

/* ***************************
 * Deliver Add Classification View 
 ****************************/

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
       title: "Add New Vehicle Classification",
       nav, 
       //need this.  EJS view could throw an error because "errors" variable is expected and not found
       errors: null,
    })
}

/* ***************************
 * Deliver Add Vehicle View 
 ****************************/

invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-vehicle", {
       title: "Add New Vehicle",
       nav, 
       //need this.  EJS view could throw an error because "errors" variable is expected and not found
       errors: null,
    })
}


/* ***************************
 * Server Error for Week 3 View 
 ****************************/

invCont.findServerError = async function (req, res, next) {
    try {
        console.log("inside invController findServerError function");        
        throw new Error("Intentional server error triggered for testing purposes.");
    } catch (error) {
        error.status = 500;
        next(error);
    }
};

module.exports = invCont