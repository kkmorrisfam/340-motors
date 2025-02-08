const utilities = require(".")
const  {body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/* **********************************
 * Registration Data Validation Rules
 ************************************/

validate.registrationRules = () => {
    console.log("Inside validate.registrationRules in utilities/account-validation file")
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1}) 
            .withMessage("Please provide a first name."), //on error this message is sent
        
        //lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2}) 
            .withMessage("Please provide a last name."), //on error this message is sent

        // valid email is required and cannot already exist in the Database
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("Please provide a valid email.") //on error this message is sent
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists.  Please log in or use a different email.")
                }
            }),

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowerCase: 1,
                minUpperCase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* **********************************
 * Login Data Validation Rules
 ************************************/

validate.loginRules = () => {
    console.log("Inside validate.loginRules in utilities/account-validation file")
    return [
        // valid email is required and cannot already exist in the Database
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("Please provide a valid email."), //on error this message is sent

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowerCase: 1,
                minUpperCase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***********************************
 * Check data and return errors 
 * or continue to registration
*************************************/

validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email } = req.body
    console.log("inside validate.checkRegData in utilities/account-validation file")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            // we don't send the password back to the user            
        })
        return
    }
    next()
}

/* ***********************************
 * Check data and return errors 
 * or continue to login ???
*************************************/

validate.checkLoginData = async (req, res, next) => {
    const {account_email } = req.body
    console.log("inside validate.checkLoginData in utilities/account-validation file")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            // we don't send the password back to the user            
        })
        return
    }
    next()
}


/* **********************************
 * Update Account Info Validation Rules
 ************************************/

validate.updateAccountInfoRules = () => {
    console.log("Inside validate.updateAccountInfoRules in utilities/account-validation file")
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1}) 
            .withMessage("Please provide a first name."), //on error this message is sent
        
        //lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2}) 
            .withMessage("Please provide a last name."), //on error this message is sent

        // valid email is required and cannot already exist in the Database
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("Please provide a valid email.") //on error this message is sent
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists.  Please use a different email.")
                }
            }),        
    ]
}

/* **********************************
 * Update Password Validation Rules
 ************************************/

validate.updatePasswordRules = () => {
    console.log("Inside validate.updatePasswordRules in utilities/account-validation file")
    return [        
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowerCase: 1,
                minUpperCase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***********************************
 * Check data and return errors 
 * or continue to management view
*************************************/

validate.checkAccountUpdateData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email } = req.body
    console.log("inside validate.checkAccountUpdateData in utilities/account-validation file")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Account Update",
            nav,
            account_firstname,
            account_lastname,
            account_email,            
        })
        return
    }
    next()
}

/* ***********************************
 * Check data and return errors 
 * or continue to management view
*************************************/

validate.checkPassword = async (req, res, next) => {
    
    console.log("inside validate.checkPassword in utilities/account-validation file")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Account Update",
            nav,
        })
        return
    }
    next()
}


module.exports = validate