const EmailPreference = require("../models/advertisementModel/promotionToUser/emailPreference");

const checkEmailPreference = async (userId) => {
  try {
    const preference = await EmailPreference.findOne({ where: { userId } });

    if (!preference) {
      return {
        success: true,
        promotions: false,
        productLaunches: false,
        message: "No email preference found. Using default values (false).",
      };
    }

    return {
      success: true,
      promotions: preference.promotions,
      productLaunches: preference.productLaunches,
      message: "Email preferences retrieved successfully.",
    };
  } catch (error) {
    console.error(
      `Error checking email preferences for user ${userId}:`,
      error
    );

    return {
      success: false,
      promotions: false,
      productLaunches: false,
      message: "Error occurred while retrieving email preferences.",
    };
  }
};

module.exports = checkEmailPreference;
