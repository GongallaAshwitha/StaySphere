const User = require("../models/user");

// =====================
// Render Signup Page
// =====================
module.exports.renderSignup = (req, res) => {
    res.render("users/signup");
};

// =====================
// Signup User
// =====================
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });

        // Register user
        const registeredUser = await User.register(newUser, password);

        // Auto login
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Staysphere!");

            // Safe redirect
            const redirectUrl = req.session.returnTo || "/listings";
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// =====================
// Render Login Page
// =====================
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// =====================
// Login User
// =====================
module.exports.login = (req, res) => {
    req.flash("success", "Successfully logged in!");

    // Safe redirect
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// =====================
// Logout User
// =====================
module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);

        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};
