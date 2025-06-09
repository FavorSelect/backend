const express = require("express");
const { getRevenueOverTime, getOrdersByCategory } = require("../../controllers/statistics/graphData");

const router = express.Router();

router.get("/analytics/orders-by-category", getOrdersByCategory);
router.get("/analytics/revenue", getRevenueOverTime);


module.exports = router;
