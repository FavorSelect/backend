const express = require("express");
const { handleGetRecentUsers, handleAdminLatestOrders, getLatestCombinedLatestTickets } = require("../../controllers/statistics/recent");
const router = express.Router();

router.get("/latest-users", handleGetRecentUsers);
router.get("/latest-orders", handleAdminLatestOrders);
router.get("/latest-tickets", getLatestCombinedLatestTickets);

module.exports = router;
