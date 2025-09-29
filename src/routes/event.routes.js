const { Router } = require("express");
const ctrl = require("../controllers/event.controller");

const { requireAuth } = require("../middlewares/auth");

const router = Router();
router.get("/", requireAuth,ctrl.listEvents);
router.post("/", requireAuth,ctrl.createEvent);
router.get("/:category",requireAuth, ctrl.getEventByCategory);
router.get("/:id",requireAuth, ctrl.getEvent);
router.put("/:id", requireAuth,ctrl.updateEvent);
router.delete("/:id", requireAuth, ctrl.deleteEvent);


module.exports = router;