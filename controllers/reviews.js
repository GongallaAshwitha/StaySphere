const Listing = require("../models/listings");
const Review = require("../models/review");

// =======================
// CREATE REVIEW
// =======================
module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body.review || {};

        if (!comment || !rating) {
            req.flash("error", "Comment and rating are required!");
            return res.redirect(`/listings/${id}`);
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const review = new Review({
            comment,
            rating,
            author: req.user._id,
            listing: listing._id
        });

        await review.save();
        listing.reviews.push(review._id);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};

// =======================
// DELETE REVIEW
// =======================
module.exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${id}`);
        }

        // Only author can delete
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to delete this review!");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};
