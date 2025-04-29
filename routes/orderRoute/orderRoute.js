const express = require('express');
const { handleBuyNow, handlePlaceOrderFromCart, handleGetUserOrders, handleGetSingleOrderDetails } = require('../../controllers/orderController/orderController');
const router = express.Router();

router.post('/buy-now',  handleBuyNow);
router.post('/place-order-from-cart', handlePlaceOrderFromCart);
router.get('/my-orders',  handleGetUserOrders);
router.get('/my-orders/:orderId',  handleGetSingleOrderDetails);

module.exports = router;
