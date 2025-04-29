const express = require("express");
const { handleAssignMembershipToSeller, handleRenewSellerMembership } = require("../../../controllers/membershipController/sellerMembership");



const router = express.Router();

router.patch('/memberships/assign-membership',handleAssignMembershipToSeller);
router.patch('/memberships/renew-membership',  handleRenewSellerMembership);


module.exports = router;