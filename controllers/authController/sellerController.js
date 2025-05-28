const bcrypt = require("bcrypt");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const setTokenCookie = require("../../authService/setTokenCookie");
const Seller = require("../../models/authModel/sellerModel");
const User = require("../../models/authModel/userModel");
const { Op } = require("sequelize");
const {
  sendVerificationEmail,
  sendWelcomeEmailToSeller,
  sendSellerApprovalEmail,
} = require("../../emailService/sellerAuthEmail/sellerAuthEmail");
const {
  sendForgetPasswordURL,
  sendRecoveryEmail,
} = require("../../emailService/userAuthEmail/userAuthEmail");
const { createToken } = require("../../authService/authService");


const sellerSignup = async (req, res) => {
  const t = await sequelize.transaction();  
  try {
    const {
      sellerName,
      shopName,
      businessRegistrationNumber,
      taxIdentificationNumber,
      businessType,
      businessAddress,
      contactNumber,
      email,
      shopDescription,
      countryName,
      state,
      city,
      zipCode,
      password,
    } = req.body;
    const files = req.files;

    if (
      !files.shopLogo ||
      !files.businessLicenseDocument ||
      !files.taxDocument
    ) {
      return res.status(400).json({
        success: false,
        message: "All required files must be uploaded.",
      });
    }

    const shopLogoUrl = files.shopLogo[0].location;
    const businessLicenseDocumentUrl = files.businessLicenseDocument[0].location;
    const taxDocumentUrl = files.taxDocument[0].location;

    if (
      !sellerName ||
      !shopName ||
      !businessRegistrationNumber ||
      !taxIdentificationNumber ||
      !businessType ||
      !businessAddress ||
      !contactNumber ||
      !email ||
      !shopDescription ||
      !countryName ||
      !state ||
      !city ||
      !zipCode ||
      !password
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingSeller = await Seller.findOne({ where: { email }, transaction: t });
    if (existingSeller) {
      await t.rollback();
      return res.status(409).json({ message: "Seller with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'seller',
      firstName: sellerName,
      isVerified: true,
      isTwoFactorAuthEnable:false,
    }, { transaction: t });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);


    const newSeller = await Seller.create({
      sellerName,
      shopName,
      businessRegistrationNumber,
      taxIdentificationNumber,
      businessType,
      businessAddress,
      contactNumber,
      email,
      shopDescription,
      countryName,
      state,
      city,
      isApproved: false,
      isVerified: false,
      userId: newUser.id,
      zipCode,
      shopLogo: shopLogoUrl,
      businessLicenseDocument: businessLicenseDocumentUrl,
      taxDocument: taxDocumentUrl,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
    }, { transaction: t });

    await t.commit();

    await sendVerificationEmail(newSeller.email, newSeller.sellerName, verificationCode);

    return res.status(201).json({
      message: "Seller registered successfully. Pending approval.",
      newSeller,
      userId: newUser.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("Seller Signup Error:", error);
    return res.status(500).json({ message: "Server error during seller signup" });
  }
};

const resendSellerVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ where: { email } });
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    if (seller.isVerified)
      return res.status(400).json({ message: "Seller already verified" });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    seller.verificationCode = verificationCode;
    seller.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await seller.save();

    await sendVerificationEmail(
      seller.email,
      seller.sellerName,
      verificationCode
    );

    return res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifySellerEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const seller = await Seller.findOne({
      where: {
        verificationCode: verificationCode,
        verificationCodeExpiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    seller.isVerified = true;
    seller.verificationCode = null;
    seller.verificationCodeExpiresAt = null;

    await seller.save();

    await sendWelcomeEmailToSeller(seller.email, seller.sellerName);
    await sendSellerApprovalEmail(seller.email, seller.sellerName);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      seller,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying email",
    });
  }
};

const sellerSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ where: { email } });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    if (!seller.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
    }
    if (!seller.isApproved) {
      return res.status(400).json({
        message: "You are not approved yet. Please wait for admin approval.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, seller.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const user = await User.findByPk(seller.userId);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }


    const token = createToken(user);
    setTokenCookie(res, token); 

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Seller Signin Error:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};


const handleSellerLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

const handleSellerForgotPasswordURL = async (req, res) => {
  const { email } = req.body;

  try {
    const seller = await Seller.findOne({ where: { email } });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const resetToken = JWT.sign(
      { userId: seller._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendForgetPasswordURL(seller.email, resetLink);

    return res.status(200).json({ message: "reset link sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

const handleSellerResetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword} = req.body;

    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
    const seller = await Seller.findByPk(decoded.sellerId);
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedPassword;
    await seller.save();

    await sendRecoveryEmail(seller.email, seller.name);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};

module.exports = {
  sellerSignup,
  verifySellerEmail,
  sellerSignin,
  handleSellerLogout,
  handleSellerForgotPasswordURL,
  handleSellerResetPassword,
  resendSellerVerificationOtp,
};
