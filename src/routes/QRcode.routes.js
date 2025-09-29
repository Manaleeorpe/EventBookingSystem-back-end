const { Router } = require("express");
const ctrl = require("../controllers/Qrcode.controller");

const { requireAuth } = require("../middlewares/auth");

const router = Router();
router.get("/",requireAuth, ctrl.createQRcode);
router.get("/:id",requireAuth, ctrl.getQRcode);
router.get("/scan/:tokenId",requireAuth, ctrl.scanQRcode);

module.exports = router;