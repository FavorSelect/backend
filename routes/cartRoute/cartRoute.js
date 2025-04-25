const express = require("express");
const { handleAddToCart, handleGetUserCart, updateCartItemQuantity, handleRemoveCartItem, handleRemoveSelectedCartItems, handleRemoveAllCartItems } = require("../../controllers/cartController/cartController");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware/authMiddleware");
const router = express.Router();


router.get('/',checkForAuthenticationCookie("token"), handleGetUserCart)
router.post('/add', checkForAuthenticationCookie("token"),handleAddToCart)
router.put('/update/:itemId',checkForAuthenticationCookie("token"),updateCartItemQuantity)
router.delete('/remove/:itemId',checkForAuthenticationCookie("token"),handleRemoveCartItem)
router.delete('/remove-selected/:itemIds',checkForAuthenticationCookie("token"), handleRemoveSelectedCartItems)
router.delete('/remove-all',checkForAuthenticationCookie("token"), handleRemoveAllCartItems)
module.exports = router;
