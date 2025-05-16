const express = require('express');
const { handleGetAllSellers, handleGetSellerDetails, handleUpdateSellerStatus, handleDeleteSeller, handleGetSellerByContact, handleGetSellerByMembershipId, handleGetSellerByEmail } = require('../../../controllers/adminController/sellerDetail/sellerDetail');

const router = express.Router();

router.get('/sellers', handleGetAllSellers);
router.get('/sellers/:sellerId', handleGetSellerDetails);
router.patch('/sellers/:sellerId/status', handleUpdateSellerStatus);
router.delete('/sellers/:sellerId', handleDeleteSeller);
router.get('/sellers/contact/:contact', handleGetSellerByContact);
router.get('/sellers/membership/:membershipId', handleGetSellerByMembershipId);
router.get('/sellers/email/:email', handleGetSellerByEmail);

module.exports = router;