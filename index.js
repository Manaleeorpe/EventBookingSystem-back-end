const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const routes = require("./src/routes"); // central router
const passport = require("passport");
const cors = require('cors');

require("dotenv").config();
const session = require("express-session");

const app = express();

 const URL  = process.env.FrontEnd_URL  || 'http://localhost:3000';
app.use(
  cors({
    origin: 'http://localhost:3000', // ✅ Frontend origin
    credentials: true,              // ✅ Allow cookies
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});