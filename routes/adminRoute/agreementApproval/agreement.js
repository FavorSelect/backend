const express = require("express");
const { getPendingSellerAgreementApproval, handleApproveSellerAgreement, handleRejectSellerAgreement } = require("../../../controllers/adminController/approvalAgreement");

const router = express.Router();


router.get('/pending-seller-agreement', getPendingSellerAgreementApproval)
router.patch('/pending-seller-agreement/:agreementId/approve', handleApproveSellerAgreement);
router.patch('/pending-seller-agreement/:agreementId/reject',handleRejectSellerAgreement);



module.exports = router;