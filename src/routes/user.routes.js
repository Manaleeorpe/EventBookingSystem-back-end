const { Router } = require("express");
const ctrl = require("../controllers/user.controller");

const { requireAuth } = require("../middlewares/auth");

const router = Router();
router.get("/", requireAuth,ctrl.listUsers);
router.post("/",requireAuth, ctrl.createUser);
router.get("/:id",requireAuth, ctrl.getUser);
router.put("/:id", requireAuth,ctrl.updateUser);
router.delete("/:id",requireAuth, ctrl.deleteUser);

module.exports = router;