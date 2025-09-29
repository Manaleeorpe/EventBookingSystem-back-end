const { Router } = require("express");
const userRoutes = require("./user.routes");
const GoogleRoutes = require("./google.routes");
const eventRoutes = require("./event.routes");
const ticketRoutes = require("./ticket.routes");
const QRcodeRoutes = require("./QRcode.routes");

const router = Router();

// version or base path here if you like
router.use("/users", userRoutes);   // endpoints become /users/...
//router.use("/tickets", ticketRoutes); // endpoints become /tickets/...
router.use("/auth/google/", GoogleRoutes); 

router.use("/events", eventRoutes); 
router.use("/qrcode", QRcodeRoutes);

router.use("/ticket", ticketRoutes);

module.exports = router;