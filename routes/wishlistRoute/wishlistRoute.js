const express = require('express');

const router = express.Router();

router.post('/add',addToWishlist);
router.get('/',  getWishlist);
router.delete('/remove/:wishlistId',removeFromWishlist);

module.exports = router;
