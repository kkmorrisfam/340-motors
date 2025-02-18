/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index") /* can also just use ("./utilities/") because index is a default value*/
const session = require("express-session")
const pool = require('./database/')
// const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const reviewRoute = require("./routes/reviewRoute")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //not at the root


/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new(require('connect-pg-simple')(session)) ({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET, 
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(cookieParser())

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))  // for parsing application/x-www-urlencoded

app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route

//this renders the home page here within the route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })

//this uses the baseController to build the home page through the buildHome method
// app.get("/", baseController.buildHome)
//add error Handling
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
// any route that starts with /inv will then be redirected to the inventoryRoute.js file to find the 
// rest of the route in order to fulfill the request
app.use("/inv", inventoryRoute)

// Account route for login and register
app.use("/account", require("./routes/accountRoute")) //can also write it like this
// app.use("/account", accountRoute)

// Review route for customer reviews
app.use("/reviews", reviewRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
   // console.log("in server.js file; app.use, file not found")
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware!
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: ${req.originalUrl}: ${err.message}`)
  
  let status = err.status || 500; //use this to put in code in case err.status doesn't return a value
  if (status == 404) {message = err.message} else {message = `Error ${status}: Oh no!  There was a crash. Maybe try a different route?`}
  res.status(status).render("errors/error", {
    title: err.status || 'Server Error',
    // title: `Error ${status}`,
    // message: err.message,
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
