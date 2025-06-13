const express = require("express");
const { getNotifications } = require("../../controllers/notifications/userNotification");
const optionalAuthentication = require("../../authMiddleware/optionalMiddleware");
const router = express.Router();


router.get("/notifications", optionalAuthentication("token"), getNotifications);

module.exports = router;
