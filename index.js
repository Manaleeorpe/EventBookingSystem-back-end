const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const routes = require("./src/routes"); // central router
const passport = require("passport");
const cors = require('cors');

require("dotenv").config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_BASE_URL,
  FrontEnd_URL,
  GOOGLE_CALLBACK_URL, DATABASE_URL,
} = process.env;

const FRONTENDS = [
  process.env.FrontEnd_URL, // your deployed frontend origin
  "http://localhost:3000",         // local dev fallback
].filter(Boolean);


const session = require("express-session");

const app = express();

 const URL  = process.env.FrontEnd_URL  || 'http://localhost:3000';
app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin and non-browser requests (no Origin header)
      if (!origin) return cb(null, true);
      if (FRONTENDS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
  })
);
const prisma = new PrismaClient();

app.use(express.json());

// 1) Enable cookie-based sessions (required if you want login to persist)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // secure: true,      // enable in production with HTTPS
      // sameSite: "lax",   // adjust for cross-site frontends
    },
  })
);
// 2) Initialize Passport and hook it into sessions
app.use(passport.initialize());
app.use(passport.session());



// mount all feature routers under a base path
app.use("/", routes); // or app.use("/api", routes)

// graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

console.log(GOOGLE_CALLBACK_URL)
console.log(GOOGLE_CLIENT_SECRET)
console.log(GOOGLE_CLIENT_ID)
console.log(API_BASE_URL)
console.log(DATABASE_URL)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});