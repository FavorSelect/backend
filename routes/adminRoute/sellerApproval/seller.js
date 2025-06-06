const express = require("express");
const { getPendingSellerApproval, handleApproveSeller, handleRejectSeller, getPendingSellerDetailsById } = require("../../../controllers/adminController/approval/approvalRequest");

const router = express.Router();
router.get('/pending-seller',getPendingSellerApproval)
router.get('/pending-seller/:sellerId', getPendingSellerDetailsById);
router.patch('/pending-seller/:sellerId/approve', handleApproveSeller);
router.patch('/pending-seller/:sellerId/reject',handleRejectSeller);
module.exports = router;