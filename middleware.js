const Listing = require("./models/listings");

// ================= IS LOGGED IN =================
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        // Save original URL before login
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};


// ================= SAVE REDIRECT URL =================
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};


// ================= IS OWNER =================
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // 🔥 Check ownership
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
