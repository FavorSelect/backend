const express = require('express');
const { handleBuyNow, handlePlaceOrderFromCart, handleGetUserOrders, handleGetSingleOrderDetails } = require('../../controllers/orderController/orderController');
const router = express.Router();

router.post('/order/buy-now',  handleBuyNow);
router.post('/order/place-order-from-cart', handlePlaceOrderFromCart);
router.get('/order',  handleGetUserOrders);
router.get('/order/:orderId',  handleGetSingleOrderDetails);

module.exports = router;
