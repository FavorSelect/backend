const express = require('express');
const { toggleLikeOnReview, getUsersWhoLikedReview } = require('../../controllers/reviewLikeController/reviewLikeController');

const router = express.Router();

router.post('/review/:reviewId/like-toggle',  toggleLikeOnReview);
router.get('/review/:reviewId/liked-users', getUsersWhoLikedReview);

module.exports = router;
