const EmailPreference = require('../../../models/advertisementModel/promotionToUser/emailPreference');

const updateEmailPreferences = async (req, res) => {
  const userId = req.user.id;
  const { promotions, productLaunches } = req.body;

  try {
   
    const existingPref = await EmailPreference.findOne({ where: { userId } });

    if (existingPref) {
      await existingPref.update({
        promotions: promotions !== undefined ? promotions : existingPref.promotions,
        productLaunches: productLaunches !== undefined ? productLaunches : existingPref.productLaunches,
      });
    } else {
      await EmailPreference.create({
        userId,
        promotions: promotions || false,
        productLaunches: productLaunches || false,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email preferences updated successfully.',
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email preferences.',
      error: error.message,
    });
  }
};

module.exports = { updateEmailPreferences };