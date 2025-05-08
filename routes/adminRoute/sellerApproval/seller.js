const express = require("express");
const { getPendingSellerApproval, handleApproveSeller, handleRejectSeller } = require("../../../controllers/adminController/approvalRequest");
const router = express.Router();
router.get('/pending-seller',getPendingSellerApproval)
router.patch('/pending-seller/:sellerId/approve', handleApproveSeller);
router.patch('/pending-seller/:sellerId/reject',handleRejectSeller);
module.exports = router;