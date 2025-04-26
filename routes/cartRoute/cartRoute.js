const express = require("express");
const { handleAddToCart, handleGetUserCart, updateCartItemQuantity, handleRemoveCartItem, handleRemoveSelectedCartItems, handleRemoveAllCartItems } = require("../../controllers/cartController/cartController");
const router = express.Router();


router.get('/', handleGetUserCart)
router.post('/add',handleAddToCart)
router.put('/update/:itemId',updateCartItemQuantity)
router.delete('/remove/:itemId',handleRemoveCartItem)
router.delete('/remove-selected/:itemIds', handleRemoveSelectedCartItems)
router.delete('/remove-all', handleRemoveAllCartItems)
module.exports = router;
