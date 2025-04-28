const express = require('express');
const { handleAddReview, handleGetProductReviews } = require('../../controllers/reviewController/reviewController');
const router = express.Router();

router.post('/add', handleAddReview);
router.get('/product/:productId', handleGetProductReviews);

module.exports = router;
