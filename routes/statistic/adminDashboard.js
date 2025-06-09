const express = require("express");
const { getAllAdminStats } = require("../../controllers/statistics/adminStats");
const router = express.Router();


router.get("/admin-stats", getAllAdminStats);

module.exports = router;
