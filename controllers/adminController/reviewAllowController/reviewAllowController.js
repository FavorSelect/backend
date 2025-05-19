const User = require('../../../models/authModel/userModel');

const toggleUserReviewPermission = async (req, res) => {
  const { userId } = req.params;  
  const { canReview } = req.body; 
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.canReview = canReview;
    await user.save();

    res.status(200).json({ success: true, message: `User review permission updated to ${canReview}` });
  } catch (error) {
    console.error('Admin update review permission error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
module.exports = {
    toggleUserReviewPermission
}
