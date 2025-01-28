/* Week 4 Add Login Route to be used with login
*/
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// the server.js file has the "/account" part of the path, then sends it to this file.  When the route
// also has "/login" after "/account"  it then adds the 
// instruction to go run the buildLogin function in the accountController file
console.log("inside accountRoute")
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;