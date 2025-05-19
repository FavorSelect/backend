const express = require("express");
const { handleAddToCart, handleGetUserCart, updateCartItemQuantity, handleRemoveCartItem, handleRemoveSelectedCartItems, handleRemoveAllCartItems, handleGetCartSummary } = require("../../controllers/cartController/cartController");
const router = express.Router();


router.get('/cart', handleGetUserCart)
router.post('/cart/add',handleAddToCart)
router.put('/cart/update/:itemId',updateCartItemQuantity)
router.delete('/cart/remove/:itemId',handleRemoveCartItem)
router.delete('/cart/remove-selected', handleRemoveSelectedCartItems)
router.delete('/cart/remove-all', handleRemoveAllCartItems);
router.get('/cart/summary', handleGetCartSummary);
module.exports = router;
