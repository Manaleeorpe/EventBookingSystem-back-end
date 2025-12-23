const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const app = express();
const isProd = process.env.NODE_ENV === "production";

// -------------------- CORS --------------------
const FRONTENDS = [
  "https://eventbookingsystem-front-end-production.up.railway.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (FRONTENDS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

// -------------------- BODY --------------------
app.use(express.json());

// -------------------- TRUST PROXY (CRITICAL FOR PROD) --------------------
if (isProd) {
  app.set("trust proxy", 1);
}

// -------------------- SESSION --------------------
app.use(
  session({
    // 🔐 DEFAULT cookie name = connect.sid
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    proxy: isProd,

    cookie: {
      httpOnly: true,
      secure: isProd,                   // HTTPS only in prod
      sameSite: isProd ? "none" : "lax", // cross-site frontend
      maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
    },
  })
);

// -------------------- PASSPORT --------------------
app.use(passport.initialize());
app.use(passport.session());

// -------------------- ROUTES --------------------
const routes = require("./src/routes");
app.use("/", routes);

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
