const utilities = require(".")
const  {body, validationResult } = require("express-validator")
const validate = {}


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
            .withMessage("Please provide a last name."), //on error this message is sent

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

module.exports = validate