const pool = require("../database/");

/* ***************************
 *  Get approved classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    `SELECT * FROM public.classification AS c
    WHERE c.classification_approved
    ORDER BY classification_name`
  );
}

async function getClassificationsInStock() {
  return await pool.query(
    `SELECT * FROM public.classification AS c
    INNER JOIN public.inventory as i
    USING (classification_id)
    WHERE c.classification_approved
    AND i.inv_approved
    ORDER BY classification_name`
  );
}

/* ***************************
 *  Get non-approved classification data
 * ************************** */
async function getClassificationsPendingApproval() {
  return await pool.query(
    `SELECT * FROM public.classification AS c WHERE c.classification_approved = FALSE ORDER BY classification_name`
  );
}

async function getInventoryPendingApproval() {
  return await pool.query(
    `SELECT * FROM public.inventory AS i
    WHERE i.inv_approved = FALSE`
  );
}

/* ***************************
 *  Get approved inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
      AND i.inv_approved`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get one item by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getinventorybyid error " + error);
  }
}

async function createNewClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const response = await pool.query(sql, [classification_name]);
    return response;
  } catch (error) {
    return error.message;
  }
}

async function createNewVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_miles,
  inv_color,
  inv_image,
  inv_thumbnail,
  classification_id
) {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const response = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      classification_id,
    ]);
    return response;
  } catch (error) {
    return error.message;
  }
}

async function updateVehicle(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_miles,
  inv_color,
  inv_image,
  inv_thumbnail,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

async function deleteVehicle(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error");
  }
}

async function approveClass(classification_id, admin_id) {
  try {
    const sql =
      "UPDATE public.classification SET classification_approved = TRUE, account_id = $1, classification_approval_date = $2 WHERE classification_id = $3 RETURNING *";
    const data = await pool.query(sql, [
      admin_id,
      new Date(),
      classification_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error(`Problem approving classification: ${error}`);
  }
}

async function approveVehicle(inv_id, admin_id) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_approved = TRUE, account_id = $1, inv_approved_date = $2 WHERE inv_id = $3 RETURNING *";
    const data = await pool.query(sql, [
      admin_id,
      new Date(),
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error(`Problem approving vehicle: ${error}`);
  }
}

module.exports = {
  getClassifications,
  getClassificationsInStock,
  getClassificationsPendingApproval,
  getInventoryPendingApproval,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  createNewClassification,
  createNewVehicle,
  updateVehicle,
  deleteVehicle,
  approveClass,
  approveVehicle,
};
