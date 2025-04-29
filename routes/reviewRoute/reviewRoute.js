const express = require('express');
const { handleAddReview, handleGetProductReviews, getReviewCountForProduct } = require('../../controllers/reviewController/reviewController');
const router = express.Router();

router.post('/add', handleAddReview);
router.get('/product/:productId', handleGetProductReviews);
router.get('/product/:productId/review-count', getReviewCountForProduct);

module.exports = router;
