const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { Op } = require("sequelize");
const setTokenCookie = require("../../authService/setTokenCookie");
const clearTokenCookie = require("../../authService/clearCookie");
const User = require("../../models/authModel/userModel");
const {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendForgetPasswordURL,
  sendRecoveryEmail,
  sendTwoFactorOtp,
} = require("../../emailService/userAuthEmail/userAuthEmail");
const { createToken } = require("../../authService/authService");
const { updateCustomers } = require("../statistics/adminStats");
const { createUserNotification } = require("../notifications/userNotification");
const UserCoupon = require("../../models/couponModel/userCouponModel");
const Coupon = require("../../models/couponModel/couponModel");

const handleSignUp = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (!existingUser.password) {
        return res.status(400).json({
          message:
            "You signed up with Google. Please log in with Google or reset your password.",
        });
      }
      return res.status(400).json({ message: "Email already registered" });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
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
      isTwoFactorAuthEnable: false,
      verificationCodeExpiresAt: verificationCodeExpiresAt,
    });

    const now = new Date();
    const welcomeCoupon = await Coupon.findOne({
      where: {
        autoAssignOnSignup: true,
        isActive: true,
        validFrom: { [Op.lte]: now },
        validTill: { [Op.gte]: now },
      },
    });

    if (welcomeCoupon) {
      await UserCoupon.create({
        userId: newUser.id,
        couponId: welcomeCoupon.id,
        used: false,
      });

      await createUserNotification({
        userId: newUser.id,
        title: " Welcome Coupon Assigned!",
        message: `You've received a welcome coupon "${
          welcomeCoupon.code
        }" worth ₹${
          welcomeCoupon.discountAmount || welcomeCoupon.discountPercentage + "%"
        }!`,
        type: "coupon",
        coverImage: null,
      });
    }

    await updateCustomers();
    await sendVerificationEmail(
      newUser.email,
      newUser.firstName,
      verificationCode
    );
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
};

const resendUserVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await user.save();
    await sendVerificationEmail(user.email, user.firstName, verificationCode);
    return res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await user.save();
    await sendVerificationEmail(user.email, user.firstName, verificationCode);
    return res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleVerifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;
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

const handleVerifyResetPasswordOtp = async (req, res) => {
  try {
    const { verificationCode } = req.body;
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
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If 2FA is enabled, send OTP
    if (user.isTwoFactorAuthEnable) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;
      await user.save();

      await sendTwoFactorOtp(user.email, user.firstName, verificationCode);

      return res.status(202).json({
        success: true,
        message: "OTP sent to your email. Please verify to complete login.",
        isTwoFactorAuthEnable: user.isTwoFactorAuthEnable,
      });
    }

    // If no 2FA, log user in
    const token = createToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

const verify2FALogin = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    console.log("Received 2FA verification code:", verificationCode);
    const user = await User.findOne({
      where: {
        verificationCode: verificationCode,
        verificationCodeExpiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      console.log("Invalid or expired verification code.");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    console.log("User verified:", user.email);

    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    console.log("Verification fields cleared.");

    const token = createToken(user);
    console.log("JWT token created:", token);

    setTokenCookie(res, token);
    console.log("Token cookie set successfully.");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("2FA verification error:", error.message);
    return res
      .status(500)
      .json({ message: "2FA verification failed", error: error.message });
  }
};

const handleLogout = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};
const handleFindMyAccountPasswordURL = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = JWT.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const resetLink = `${process.env.FRONTEND_URL_MAIN}/set-password/${resetToken}`;
    await sendForgetPasswordURL(user.email, resetLink);

    return res
      .status(200)
      .json({ message: "reset link sent to email", resetLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

const handleUserResetPasswordFromUrl = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    console.log(newPassword);
    console.log(resetToken);
    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sendRecoveryEmail(user.email, user.firstName);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};

const handleUserResetPasswordFromOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    await sendRecoveryEmail(user.email, user.firstName);
    return res.status(200).json({ message: "Password Reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Reseting  password", error: error.message });
  }
};

module.exports = {
  handleSignUp,
  handleVerifyEmail,
  handleSignin,
  handleLogout,
  handleFindMyAccountPasswordURL,
  handleUserResetPasswordFromUrl,
  resendUserVerificationOtp,
  handleResetPasswordOtp,
  handleVerifyResetPasswordOtp,
  handleUserResetPasswordFromOtp,
  verify2FALogin,
};
