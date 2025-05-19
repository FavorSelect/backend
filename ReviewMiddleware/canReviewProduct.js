const User = require('../models/authModel/userModel');


const canReviewProduct = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user.canReview) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not permitted to write reviews. Contact support.',
      });
    }
    next();
  } catch (error) {
    console.error('Purchase check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking permissions.',
      error: error.message,
    });
  }
};
module.exports = canReviewProduct;
