const Listing = require("../models/listings");

// =======================
// INDEX - Show All Listings (WITH CATEGORY FILTER)
// =======================
module.exports.index = async (req, res) => {
    const { category } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const listings = await Listing.find(filter).populate("owner");
    res.render("listings/index", { listings, category });
};

// =======================
// NEW - Render Form
// =======================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

// =======================
// SHOW - Single Listing
// =======================
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: { path: "author" }
        });

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

// =======================
// CREATE - Add Listing
// =======================
module.exports.createListing = async (req, res) => {
    try {
        // Ensure the file was uploaded
        if (!req.file) {
            req.flash("error", "Please upload an image!");
            return res.redirect("/listings/new");
        }

        const { path: url, filename } = req.file;

        // Create new listing using nested fields
        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id; // Attach logged-in user
        listing.image = { url, filename };

        await listing.save();

        req.flash("success", "Listing added successfully!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/listings/new");
    }
};

// =======================
// EDIT - Render Edit Form
// =======================
module.exports.editListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
};

// =======================
// UPDATE - Update Listing
// =======================
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    try {
        let listing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true, runValidators: true } // ensures required fields like category are validated
        );

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // If a new image was uploaded, update it
        if (req.file) {
            const { path: url, filename } = req.file;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", e.message);
        res.redirect(`/listings/${id}/edit`);
    }
};

// =======================
// DELETE - Remove Listing
// =======================
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
