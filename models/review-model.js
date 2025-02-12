const pool = require("../database/");

/********************************
 *  Get all reviews by inv_id 
 ********************************/

async function getReviewByInv_id(inv_id) {
    try {
        console.log("getReviewByInv_id function");
        const data = await pool.query(
            `SELECT r.review_id, r.inv_id, r.review_text, r.review_date, a.account_id, a.account_firstname, a.account_lastname
             FROM public.review AS r
             JOIN public.account AS a
             ON r.account_id = a.account_id
             WHERE r.inv_id = $1            
             ORDER BY r.review_date DESC`,
             [inv_id]
        );
        return data.rows // will return an empty array if no reviews are found
    } catch (error) {
        console.error("getReviewByInv_id error: " + error);        
    }
}

/********************************
 * Get all reviews by account_id
 ********************************/
async function getReviewByAccount_id(account_id) {
    try {
        console.log("getReviewByAccount_id function")
        const data = await pool.query(
            `SELECT r.review_id, r.inv_id, r.review_text, r.review_date, i.inv_make, 
                i.inv_model, i.inv_year, a.account_id, a.account_firstname,
                a.account_lastname
            FROM public.review AS r
            JOIN public.account AS a
            ON r.account_id = a.account_id
            JOIN public.inventory AS i
            ON r.inv_id = i.inv_id
            WHERE r.account_id = $1
            ORDER BY r.review_date DESC`,
            [account_id]
        )
        return data.rows // will return an empty array if no reviews are found
    } catch (error) {
        console.error("getReviewByInv_id error: " + error)
    }
}

/********************************
 * add review 
 * 
 ********************************/
async function addReview() {
    console.log("inside review-model addReview")

}



/********************************
 * update review
 ********************************/
async function updateReview() {
    console.log("inside review-model updateReview")
}


/********************************
 * delete review
 ********************************/
async function deleteReview() {
    console.log("inside review-model deleteReview")
}


module.exports = { getReviewByInv_id, getReviewByAccount_id, addReview, updateReview, deleteReview }