const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by listing
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  const listing = await utilities.buildInventoryListing(data);
  let nav = await utilities.getNav();
  const invName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/listing", {
    title: invName,
    nav,
    listing,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav,
  });
};

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/new-classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build new vehicle view
 * ************************** */
invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/new-vehicle", {
    title: "New Vehicle",
    nav,
    errors: null,
  });
};

invCont.createNewClassification = async function (req, res) {
  const classification_name = req.body.classification_name;
  console.log(`The classification name is ${classification_name}`)

  const invClassResult = await invModel.createNewClassification(
    classification_name
  );
  let nav = await utilities.getNav();
  if (invClassResult) {
    req.flash(
      "notice",
      `${classification_name} classification successfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the new classification couldn't be added.");
    res.status(501).render("./inventory/new-classification", {
      title: "New Classification",
      nav,
    });
  }
};

module.exports = invCont;
