const ReviewLike = require('../../models/reviewLikeModel/reviewLikeModel');
const Review = require('../../models/reviewModel/reviewModel');
const User  = require('../../models/authModel/userModel')

const toggleLikeOnReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    const existingLike = await ReviewLike.findOne({ where: { userId, reviewId } });

    if (existingLike) {
      await existingLike.destroy();
      await Review.decrement('reviewLike', { by: 1, where: { id: reviewId } });

      return res.status(200).json({ message: 'Review unliked' });
    } else {
      await ReviewLike.create({ userId, reviewId });

      await Review.increment('reviewLike', { by: 1, where: { id: reviewId } });

      return res.status(201).json({ message: 'Review liked' });
    }
  } catch (error) {
    console.error('Error toggling like:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getUsersWhoLikedReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const likes = await ReviewLike.findAll({
      where: { reviewId },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'email', ], 
      },
    });

    const users = likes.map(like => like.User);

    res.status(200).json({
      success: true,
      reviewId,
      usersLiked: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users who liked review',
      error: error.message
    });
  }
};


module.exports = {
  toggleLikeOnReview,
  getUsersWhoLikedReview,
};
