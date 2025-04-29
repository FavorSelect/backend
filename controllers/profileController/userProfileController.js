const bcrypt = require('bcrypt');
const { User } = require('../../models/authModel/userModel'); 
const { sendUpdateProfileEmail, sendChangePasswordEmail } = require('../../emailService/userAuthEmail/userAuthEmail');

const handleUpdateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
      const {
        firstName,
        lastName,
        phone,
        address,
      } = req.body;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.address = address || user.address;
  
      await user.save();
      await sendUpdateProfileEmail(user.email, user.firstName)
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  
  const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'verificationCode', 'verificationCodeExpiresat'] }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  };
  const handleChangePassword = async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All password fields are required" });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
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
      return res.status(500).json({ message: "Error changing password", error: error.message });
    }
  };
  
  
  module.exports = {
    handleUpdateUserProfile,
    getUserProfile,
    handleChangePassword
  };
  