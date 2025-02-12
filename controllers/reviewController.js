const reviewModel = require("../models/review-model")
const utilities = require("../utilities/index")

const reviewCont = {}

/***********************************
 * Build reviews by inv_id 
 ***********************************/
reviewController.buildReviewByInv_id = async function (req, res, next) {  
    let nav = await utilities.getNav();
    console.log(
    "inside controllers/reviewController.js file reviewCont.buildReviewByInv_id function"
  );
  const inv_id = req.params.inv_id;
  
  //call the model to get the data for reviews
  const reviewData = await reviewModel.getReviewByInv_id(inv_id);
  console.log("reviewData", reviewData )
  // build list html
  const reviewList = await utilities.buildReviewListByInv_id(reviewData);
  
  // check login, if logged in add a form to add a review
  if (res.locals.loggedin) {

  }
  // else, 

  
  
  res.render("./review/inv-review", {
    title: 'Customer Reviews',
    nav,
    reviewList,
  });
};



/***********************************
 * Build reviews by account_id
 ***********************************/


/***********************************
 * add new review
 ***********************************/


/***********************************
 * update review
 ***********************************/

/***********************************
 * delete review
 ***********************************/

module.exports = reviewController