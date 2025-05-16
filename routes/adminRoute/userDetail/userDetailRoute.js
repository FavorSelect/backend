const express = require('express');
const { handleGetAllUsers, handleGetUserDetails, handleUpdateUserStatus, handleDeleteUser, handleGetUserOrderById, handleGetUserByOrderId, handleGetUserByPhone, handleGetUserByEmail } = require('../../../controllers/adminController/userDetail/userDetail');
const router = express.Router();


router.get('/users', handleGetAllUsers);
router.get('/users/:userId', handleGetUserDetails);
router.patch('/users/:userId/status', handleUpdateUserStatus);
router.delete('/users/:userId', handleDeleteUser);
router.get('/users/:userId/orders/:orderId', handleGetUserOrderById);
router.get('/users/order/:orderId', handleGetUserByOrderId);
router.get('/users/phone/:phone', handleGetUserByPhone);
router.get('/users/email/:email', handleGetUserByEmail);

module.exports = router;
