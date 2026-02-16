const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");

// =====================
// SIGNUP
// =====================
router.get("/signup", userController.renderSignup);
router.post("/signup", userController.signup);

// =====================
// LOGIN
// =====================
router.get("/login", userController.renderLogin);
router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    userController.login
);

// =====================
// LOGOUT
// =====================
router.get("/logout", userController.logout);

module.exports = router;
