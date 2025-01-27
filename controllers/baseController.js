const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
    // console.log("req in buildHome: ", req);
    console.log("inside controllers/baseController.js in baseController.buildHome function")
    const nav = await utilities.getNav()
    //line added week 4 - flash notice
    // if I add a notice back in, the class="notice" and there is already a class in the buildClassificationGrid function code
    // req.flash("notice", "This is a flash message")
    res.render("index", {title: "Home", nav})
}

module.exports = baseController