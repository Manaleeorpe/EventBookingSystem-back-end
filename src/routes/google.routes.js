const { Router } = require("express");
const ctrl = require("../controllers/google.controller");

const router = Router();
router.get("/login",requireAuth,requireAuth, ctrl.googleLogin);
router.get("/callback",requireAuth, ctrl.googleCallback);
router.get("/logout",requireAuth, ctrl.googleLogout);
router.get("/failure",requireAuth, ctrl.googleFailure);
router.get("/me",requireAuth, ctrl.me);


module.exports = router;