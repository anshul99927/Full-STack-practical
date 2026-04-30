const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");

const User = require("./models/user");
const courseRoutes = require("./routes/course");
const authRoutes = require("./routes/auth");

const app = express();

// ── Database ──────────────────────────────────────────────────────────────────
mongoose
  .connect("mongodb://127.0.0.1:27017/labexam")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── View Engine ───────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Static Files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Method Override (for PUT / DELETE from HTML forms) ────────────────────────
app.use(methodOverride("_method"));

// ── Session ───────────────────────────────────────────────────────────────────
app.use(
  session({
    secret: "labexamsecret2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ── Flash ─────────────────────────────────────────────────────────────────────
app.use(flash());

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── Locals Middleware (available in all templates) ────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/", authRoutes);
app.use("/courses", courseRoutes);

// /course/new alias handled inside course router
app.use("/course", courseRoutes);

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/courses");
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
