const { Router } = require("express");
const ctrl = require("../controllers/google.controller");

const router = Router();
router.get("/login", ctrl.googleLogin);
router.get("/callback", ctrl.googleCallback);
router.get("/logout", ctrl.googleLogout);
router.get("/failure", ctrl.googleFailure);
router.get("/me", ctrl.me);


module.exports = router;