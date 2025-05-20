const express = require("express");
const { toggleUserReviewPermission } = require("../../../controllers/adminController/reviewAllowController/reviewAllowController");
const router = express.Router();
router.put('/users/:userId/review-permission',  toggleUserReviewPermission);

module.exports = router;