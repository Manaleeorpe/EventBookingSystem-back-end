const { Router } = require("express");
const ctrl = require("../controllers/ticket.controller");

const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.post("/",requireAuth, ctrl.createTicket);
router.get("/:id",requireAuth, ctrl.viewTicket);
router.get("/scan/:tokenId", requireAuth,ctrl.scanTicket);
router.get('/debug/ticket/:tokenId',requireAuth, ctrl.debugTicketIssue);

//all tickets by a user
router.get("/user/:id", ctrl.getUserTickets);





module.exports = router;