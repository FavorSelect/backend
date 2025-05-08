const bcrypt = require("bcrypt");
const Seller = require("../../models/authModel/sellerModel");
const { sendVerificationEmail, sendWelcomeEmailToSeller, sendSellerApprovalEmail } = require("../../emailService/sellerAuthEmail/sellerAuthEmail");
const { sendForgetPasswordURL, sendRecoveryEmail } = require("../../emailService/userAuthEmail/userAuthEmail");


const sellerSignup = async (req, res) => {
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
      websiteURL,
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
      !files.identityProof ||
      !files.shopRegistrationDocument ||
      !files.taxDocument
    ) {
      return res.status(400).json({
        success: false,
        message: "All required files must be uploaded.",
      });
    }
    
    const shopLogoUrl = files.shopLogo[0].location;
    const identityProofUrl = files.identityProof[0].location;
    const shopRegistrationDocumentUrl = files.shopRegistrationDocument[0].location;
    const taxDocumentUrl = files.taxDocument[0].location;
    
    // Check if any required field is missing
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
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    //  Check if email already exists
    const existingSeller = await Seller.findOne({ where: { email } });
    if (existingSeller) {
      return res
        .status(409)
        .json({ message: "Seller with this email already exists" });
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    //  Create seller
    const newSeller = await Seller.create({
      sellerName,
      shopName,
      businessRegistrationNumber,
      taxIdentificationNumber,
      businessType,
      businessAddress,
      contactNumber,
      email,
      websiteURL,
      shopDescription,
      countryName,
      state,
      city,
      isApproved: false,
      isVerified: false,
      zipCode,
      shopLogo: shopLogoUrl,
      identityProof: identityProofUrl,
      shopRegistrationDocument: shopRegistrationDocumentUrl,
      taxDocument: taxDocumentUrl,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt: verificationCodeExpiresAt,
    });

    await sendVerificationEmail(
      newSeller.email,
      newSeller.sellerName,
      verificationCode
    );
    return res.status(201).json({
      message: "Seller registered successfully. Pending approval.",
      sellerId: newSeller.id,
    });
  } catch (error) {
    console.error("Seller Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during seller signup" });
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

    await user.save();

    await sendWelcomeEmailToSeller(seller.email, seller.sellerName);
    await sendSellerApprovalEmail(seller.email, seller.sellerName);
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

const sellerSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ where: { email } });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!seller.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }
    if (!seller.isApproved) {
      return res
        .status(400)
        .json({ message: "Look you are not approved yet, please wait while our team verify your credentials" });
    }
   
    const isPasswordMatch = await bcrypt.compare(password, seller.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createTokenForUser(seller);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
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
      return res.status(404).json({ message: 'Seller not found' });
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

    return res.status(200).json({ message: 'reset link sent to email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};


const handleSellerResetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword , confirmPassword} = req.body;

   
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
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
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


module.exports = {
  sellerSignup,
  verifySellerEmail,
  sellerSignin,
  handleSellerLogout,
  handleSellerForgotPasswordURL,
  handleSellerResetPassword
  
};
