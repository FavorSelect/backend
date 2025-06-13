const { Op } = require("sequelize");
const Notification = require("../../models/notifications/userNotification");
const createUserNotification = async ({ title, message, userId, type, coverImage }) => {
  try {
    if (!title || !message || !userId) return;
    await Notification.create({
      title,
      message,
      type,
      userId,
      coverImage,
    });
  } catch (err) {
    console.error("Auto user notification error:", err);
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const whereClause = userId
      ? {
         
          [Op.or]: [
            { userId: userId },
            { userId: null } 
          ]
        }
      : {
          userId: null
        };

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

module.exports = {
    createUserNotification,
    getNotifications
}