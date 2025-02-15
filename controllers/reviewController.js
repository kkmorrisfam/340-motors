const reviewModel = require("../models/review-model")
const utilities = require("../utilities/index")
const ejs = require("ejs")
const reviewCont = {}

/***********************************
 * Build reviews by inv_id 
 * -use this if I want to load the inventory detail first and 
 * -then load this second.  Needs AJAX
 ***********************************/
reviewCont.buildReviewByInv_id = async function (req, res, next) {  
    // let nav = await utilities.getNav();
    console.log(
    "inside controllers/reviewController.js file reviewCont.buildReviewByInv_id function"
  );
  const inv_id = req.params.inv_id;
  
  //call the model to get the data for reviews
  const reviewData = await reviewModel.getReviewByInv_id(inv_id);
  console.log("reviewData", reviewData )
  // build list html
  const reviewList = await utilities.buildReviewListByInv_id(reviewData);
  let addReview = ""
  // check login, if logged in add a form to add a review
  if (res.locals.loggedin) {
    console.log("res.locals.loggedin is true")
    const data = {
        reviewData, 
        inv_id
    };
    addReview = await ejs.renderFile("./views/review/add-form.ejs", data);

    //addReview = ejs.renderFile('.review/add-form', data)
  } else {
    console.log("res.locals.loggedin is false")
    addReview = '<p>You must first <a href="/account/login">login</a> to write a review.</p>'    
  }
  
  res.render("./review/inv-review", {
    title: 'Customer Reviews',
    nav,
    reviewList,
    addReview
  });
};




/***********************************
 * add new review
 ***********************************/
reviewCont.processAddReview = async function(req, res) {
    console.log("inside reviewController processAddReview")
    const {inv_id, account_id, review_text} = req.body
    // console.log("req.body inv_id: ", inv_id)
    // console.log("req.body account_id: ", account_id)
    // console.log("req.body review_text: ", review_text)

    //update database with model
    try {    
      const newReview = await reviewModel.addReview(review_text, inv_id, account_id);
      if (newReview) {        
        return res.redirect(`/inv/detail/${inv_id}`);
      }
    } catch {
      req.flash("notice", "Sorry, the review was not added.");
      //just go back to route and reload the vehicle page anyway
      return res.redirect(`/inv/detail/${inv_id}`);   
    }
    
    // return res.redirect(`/inv/detail/${inv_id}`);
}

/***********************************
 * update/edit review
 ***********************************/
reviewCont.buildEditReviewView = async function(req, res) {
  console.log("inside buildEditReviewView`")
}

/***********************************
 * delete review
 ***********************************/
reviewCont.buildDeleteReviewView = async function(req, res) {
  console.log("inside buildDeleteReviewView`")
}


module.exports = reviewCont