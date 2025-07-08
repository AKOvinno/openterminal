const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// Reformatting using router.route
router.route("/")
    .get(wrapAsync (listingController.index)) //index-route
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync (listingController.createListing)) //create-route
router.get("/search", wrapAsync(listingController.searchListing));
// New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm);
// We have to keep new route otherwise browser will think /new is like /:id
router.route("/:id")
    .get(wrapAsync (listingController.showListing))//show-route
    .put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), wrapAsync (listingController.updateListing))//Update-route
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing))//destroy-route
// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

module.exports = router;