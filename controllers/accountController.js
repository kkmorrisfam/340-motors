/* Week 4 Login controller
 */
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* **********************
 * Deliver login view
 *************************/

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ***************************
 * Deliver Registration view
 ****************************/

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    //need this.  EJS view could throw an error because "errors" variable is expected and not found
    errors: null,
  });
}

/* ******************************
 * Process Registration
 *******************************/

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  //Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const reqResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (reqResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}, Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ******************************
 * Login Account  
 *******************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  // check credentials  if no user matches email, return to login page
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  //if accountData exists, then try to compare passwords, the one entered with
  //the hash version stored, and run bcrypt
  //create jwt token and save it in accessToken
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      //sign the user with jwt
      const accessToken = jwt.sign(
        // accountData,
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_email: accountData.account_email,
          account_type: accountData.account_type, 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      //set res.cookie with accessToken
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } // setting httpOnly says that javascript can't be used 
      else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account");
    } //if passwords don't match, send back to login page 
    else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("accout/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ***************************
 * Deliver Account Management View 
 ****************************/

 async function buildAccountManage (req, res, next) {
    console.log("buildAccountManage view")
    let nav = await utilities.getNav()

    if (!req.user) {
      req.flash("notice", "Please log in to access your account")
      return res.redirect("/account/login");
    }

    res.render("account/accounts", {
       title: "Account Management",
       nav, 
       //need this.  EJS view could throw an error because "errors" variable is expected and not found
       errors: null,
       account_firstname: req.user.account_firstname,
       account_id: req.user.account_id,
       account_type: req.user.account_type
    })
}

async function buildUpdateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id

  // check credential match
  if(req.user.account_id != account_id) {
    req.flash("notice", "Unauthorized access.")
    return res.redirect("/account")
  }

  res.render("account/update-account", {
    title: "Account Update",
    nav,
    errors: null,
    account_firstname: req.user.account_firstname,
    account_lastname: req.user.account_lastname,
    account_email: req.user.account_email
  })
}

async function handleLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManage, buildUpdateAccount, handleLogout };
