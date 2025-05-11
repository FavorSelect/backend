const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
const { Op } = require('sequelize');
const User  = require('../../models/authModel/userModel'); 
const { createTokenForUser } = require('../../authService/authService');
const { sendWelcomeEmail, sendVerificationEmail, sendForgetPasswordURL, sendRecoveryEmail } = require('../../emailService/userAuthEmail/userAuthEmail');


const handleSignUp = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;


  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const verificationCode = Math.floor(100000+Math.random()*900000).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpiresAt:verificationCodeExpiresAt,
    });
    await sendVerificationEmail(newUser.email, newUser.firstName, verificationCode);
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      newUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};


const handleVerifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
console.log("Received verificationCode:", verificationCode); // <-- ADD THIS
  try {
    const user = await User.findOne({
      where: {
        verificationCode: verificationCode,
        verificationCodeExpiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;

    await user.save();

    await sendWelcomeEmail(user.email, user.firstName);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying email",
    });
  }
};



const handleSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createTokenForUser(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const handleLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};


const handleForgotPasswordURL = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = JWT.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendForgetPasswordURL(user.email, resetLink);

    return res.status(200).json({ message: 'reset link sent to email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};


const handleUserResetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword , confirmPassword} = req.body;

   
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await sendRecoveryEmail(user.email, user.name);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

module.exports = {
  handleSignUp,
  handleVerifyEmail,
  handleSignin,
  handleLogout,
  handleForgotPasswordURL,
  handleUserResetPassword,
};
