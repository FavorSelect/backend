const express = require("express");
const { handleCreateMembership, handleUpdateMembership, handleDeleteMembership, handleDeleteSellerMembership } = require("../../../controllers/membershipController/handleMembership");
const { handleGetAllMemberships, handleGetMembershipById } = require("../../../controllers/membershipController/sellerMembership");

const router = express.Router();

router.get('/memberships', handleGetAllMemberships);
router.get('/memberships/:membershipId',handleGetMembershipById);
router.post('/memberships/create-membership',handleCreateMembership);
router.put('/memberships/:membershipId', handleUpdateMembership);
router.delete('/memberships/:membershipId/delete-membership', handleDeleteMembership);
router.delete('/memberships/:sellerId/delete-membership', handleDeleteSellerMembership);

module.exports = router;