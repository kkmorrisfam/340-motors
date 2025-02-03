const pool = require("../database/")

/**************************
 * Get all classification data
 * ************************ */
async function getClassifications() {
    console.log("inside models/inventory-model.js in getClassifications function to run Select all SQL query")
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/*  ******************************
    * Get all inventory items and classification_name by classification_id
    ******************************/
async function getInventoryByClassificationId(classification_id) {
    try {
      console.log("inside models/inventory-model.js file in getInventoryByClassificationId function to run JOIN SQL query" )
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  /*  ******************************
    * Get a single vehicle by inv_id
    ******************************/

async function getInventoryByInv_id(inv_id) {
  try {
    console.log("inside models/inventory-model.js file in getInventoryByInv_id function to run SQL")
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByInv_id " + error)
  }
}

/* *********************
 * Add new classification
 ***********************/

async function addNewClassification(  
  classification_name
) {
  console.log("inside inventory-model addNewClassification function.")
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [
      classification_name
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *********************
 * Add new vehicle
 ***********************/

async function addNewVehicle(
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_color,  
  inv_price,
  inv_miles,
  inv_description,
  inv_image,
  inv_thumbnail,
) {
  try {
    const sql =
      "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_color, inv_price, inv_miles, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_color,  
      inv_price,
      inv_miles,
      inv_description,
      inv_image,
      inv_thumbnail,
    ]);
  } catch (error) {
    return error.message;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInv_id, addNewClassification, addNewVehicle};