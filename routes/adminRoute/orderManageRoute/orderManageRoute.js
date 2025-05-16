const express = require('express');
const { handleGetAllOrders, handleGetOrderById, handleGetOrdersByUserId, handleUpdateOrderStatus, handleUpdatePaymentStatus, handleUpdateShippingDates, handleDeleteOrder } = require('../../../controllers/adminController/orderController/orderController');
const router = express.Router();

router.get('/orders', handleGetAllOrders);
router.get('/orders/:orderId', handleGetOrderById);
router.get('/users/:userId/orders', handleGetOrdersByUserId);
router.patch('/orders/:orderId/status', handleUpdateOrderStatus);
router.patch('/orders/:orderId/payment-status', handleUpdatePaymentStatus);
router.patch('/orders/:orderId/shipping-dates', handleUpdateShippingDates);
router.delete('/orders/:orderId', handleDeleteOrder);

module.exports = router;
