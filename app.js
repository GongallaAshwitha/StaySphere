if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ======================
// CLOUDINARY CONFIG
// ======================
const { cloudinary, storage } = require("./cloudConFig");

// ======================
// MODELS
// ======================
const User = require("./models/user");
const Listing = require("./models/listings");

// ======================
// ROUTES
// ======================
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

// ======================
// UTILS
// ======================
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

// ======================
// DATABASE CONNECTION
// ======================
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/myDB";

mongoose.connect(dbUrl)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error("DB Connection Error:", err));

// ======================
// MIDDLEWARE
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// SESSION & FLASH
// ======================
console.log("DB URL:", dbUrl);
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: "mysupersecretcode",
    touchAfter: 24 * 3600
});

store.on("error", function(err) {
    console.log("Session store error:", err);
});

const sessionConfig = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
};

app.use(session(sessionConfig));
app.use(flash());

// ======================
// PASSPORT CONFIG
// ======================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
// FLASH & CURRENT USER
// ======================
// ======================
// FLASH & CURRENT USER
// ======================
app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currentUser = req.user || null;
    next();
});





// ======================
// STORE RETURN URL FOR REDIRECT
// ======================
app.use((req, res, next) => {
    if (!req.isAuthenticated() && req.originalUrl !== "/login" && req.originalUrl !== "/signup") {
        req.session.returnTo = req.originalUrl;
    }
    next();
});


// ======================
// ROUTES
// ======================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ======================
// ROOT
// ======================
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    console.error(err);
    res.status(status).send(message);
});

// ======================
// SERVER START
// ======================
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
