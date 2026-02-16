const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews");

// CREATE REVIEW
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;
