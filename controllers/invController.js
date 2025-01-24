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


module.exports = invCont