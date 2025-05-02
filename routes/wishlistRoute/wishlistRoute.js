const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../../controllers/wishlistController/wishlistController');

const router = express.Router();

router.post('/add',addToWishlist);
router.get('/',  getWishlist);
router.delete('/remove/:wishlistId',removeFromWishlist);

module.exports = router;
