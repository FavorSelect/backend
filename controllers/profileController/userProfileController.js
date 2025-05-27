const bcrypt = require("bcrypt");
const User = require("../../models/authModel/userModel");
const Address = require("../../models/orderModel/orderAddressModel");
const {
  sendUpdateProfileEmail,
  sendChangePasswordEmail,
  sendTwoFactorAuthStatusEmail,
} = require("../../emailService/userAuthEmail/userAuthEmail");

const handleUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, email, state, city, country, zipCode } =
      req.body;
    const profilePhoto = req.file;
    const profilePhotoUrl = profilePhoto?.location || null;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.profilePhoto = profilePhotoUrl || user.profilePhoto;
    user.state = state || user.state;
    user.city = city || user.city;
    user.country = country || user.country;
    user.zipCode = zipCode || user.zipCode;

    await user.save();
    await sendUpdateProfileEmail(user.email, user.firstName);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "verificationCode", "verificationCodeExpiresat"],
      },
      include: [
        {
          model: Address,
          as: "addresses",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

const handleChangePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sendChangePasswordEmail(user.email, user.firstName);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

const toggleTwoFactorAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enable } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isTwoFactorAuthEnable = enable;
    await user.save();
    await sendTwoFactorAuthStatusEmail(user.email, user.firstName, enable);
    return res.status(200).json({
      success: true,
      message: `Two-Factor Authentication ${enable ? "enabled" : "disabled"}`,
      isTwoFactorAuthEnable: user.isTwoFactorAuthEnable
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTwoFactorAuthStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ['isTwoFactorAuthEnable']
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,
      isTwoFactorAuthEnable: user.isTwoFactorAuthEnable
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  handleUpdateUserProfile,
  getUserProfile,
  handleChangePassword,
  toggleTwoFactorAuth,
  getTwoFactorAuthStatus
};
