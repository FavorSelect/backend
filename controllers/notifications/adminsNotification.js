const { Op } = require("sequelize");
const Notification = require("../../models/notifications/userNotification");

const createAdminNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const coverImageFile = req.file;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }
    const coverImageUrl = coverImageFile ? coverImageFile.location : null;

    const notification = await Notification.create({
      title,
      message,
      coverImage: coverImageUrl,
      type: type || "global",
      userId: null,
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Create admin notification error:", error);
    res.status(500).json({ success: false, message: "Failed to create notification." });
  }
};

module.exports = {
  createAdminNotification,
};
