// routes/listings.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConFig"); // correct path
const upload = multer({ storage });

const { isLoggedIn, isOwner } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings.js");

// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing));

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
