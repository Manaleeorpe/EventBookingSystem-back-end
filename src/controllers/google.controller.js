// google.controller.js
// Passport + Google OAuth 2.0 with sessions.
// No database code included—add your own where indicated.
const service = require("../services/user.service");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const API_BASE_URL1 = process.env.API_BASE_URL || 'http://localhost:8080';
//const FrontEnd_URL1 = process.env.FrontEnd_URL || 'http://localhost:3000'

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_BASE_URL,
  FrontEnd_URL,
  GOOGLE_CALLBACK_URL,
} = process.env;
const FRONTEND_CALLBACK_URL = `${FrontEnd_URL}/api/Event`;
// Serialize only what you need in the session cookie (user id typically).
passport.serializeUser((user, done) => { //to add a cookie with user.id
  // Replace `user.id` with your own identifier once you add DB code.
    //done(null, user.id || user.googleId || null);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {// to the id from the cookie
  // Add your DB fetch here to return a full user object by `id`.
    // For now, restore a minimal user from the id.
    
    const data = await service.getUser(id);
    done(null, data);
});

// Configure Google strategy
//runs when Your server starts.
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    // verify callback runs with callback function
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract profile fields
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName || "User";
        const googleId = profile.id;
        const picture = profile.photos?.[0]?.value || null;

        // INSERT YOUR DB LOGIC HERE:
        // - Find an existing user by googleId (or email)
        // - Create or update the user as needed
        // - Set `appUser` to the user object your app uses
        //
          // Example shape expected by serializeUser:
    
        const user = await service.CreateUserByOAuth({email, name, googleId});

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Controller handlers
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

const googleCallback = [
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  // Success handler runs after Passport sets req.user and session
  (req, res) => {
    // Redirect wherever you want (e.g., your frontend dashboard)
    
    res.redirect(FRONTEND_CALLBACK_URL );
  },
];

function googleFailure(_req, res) {
  res.status(401).send("Google authentication failed");
}

function googleLogout(req, res, next) {
  req.logout?.((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect("/auth/google"); // or return 204
    });
  });
}

function me(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // req.user is whatever you returned in verify/deserialize
   res.json(req.user);
}

module.exports = {
  passport, // export to initialize in server
  googleLogin,
  googleCallback,
  googleFailure,
  googleLogout,
  me,
};