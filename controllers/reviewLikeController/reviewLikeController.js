const ReviewLike = require('../../models/reviewLikeModel/reviewLikeModel');
const Review = require('../../models/reviewModel/reviewModel');

const toggleLikeOnReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  try {
    // Check if the review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already liked the review
    const existingLike = await ReviewLike.findOne({ where: { userId, reviewId } });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      return res.status(200).json({ message: 'Review unliked' });
    } else {
      // Like
      await ReviewLike.create({ userId, reviewId });
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
        attributes: ['id', 'name', 'email', 'profileImage'], // Customize as needed
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
