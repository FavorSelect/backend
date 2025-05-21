const Seller = require("../../models/authModel/sellerModel");
const bcrypt = require("bcrypt");
const {
  sendSellerProfileUpdateEmail,
  sendSellerChangePasswordEmail,
} = require("../../emailService/sellerAuthEmail/sellerAuthEmail");

const updateSellerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shopName,
      taxIdentificationNumber,
      businessType,
      businessAddress,
      contactNumber,
      websiteURL,
      shopDescription,
      city,
      zipCode,
    } = req.body;

    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const files = req.files;
    const shopLogoUrl = files.shopLogo[0].location;
    const taxDocumentUrl = files.taxDocument[0].location;

    seller.shopName = shopName || seller.shopName;
    seller.taxIdentificationNumber =
    taxIdentificationNumber || seller.taxIdentificationNumber;
    seller.businessType = businessType || seller.businessType;
    seller.businessAddress = businessAddress || seller.businessAddress;
    seller.contactNumber = contactNumber || seller.contactNumber;
    seller.websiteURL = websiteURL || seller.websiteURL;
    seller.shopDescription = shopDescription || seller.shopDescription;
    seller.city = city || seller.city;
    seller.zipCode = zipCode || seller.zipCode;
    seller.shopLogo = shopLogoUrl || seller.shopLogo;
    seller.taxDocument = taxDocumentUrl || seller.taxDocument;

    await seller.save();

    await sendSellerProfileUpdateEmail(
      seller.email,
      seller.sellerName || "Seller"
    );

    return res.status(200).json({
      message: "Seller profile updated successfully",
      seller,
    });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return res.status(500).json({
      message: "Server error while updating seller profile",
    });
  }
};

const handleChangePasswordOfSeller = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedPassword;
    await seller.save();

    await sendSellerChangePasswordEmail(seller.email, seller.sellerName || "Seller");

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Server error while changing password",
      error: error.message,
    });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const seller = await Seller.findOne({
      where: { userId },
      attributes: {
        exclude: ["password", "verificationCode", "verificationCodeExpiresAt"],
      },
    });

    if (!seller) {
      return res.status(404).json({
        message: `Seller not found for user ID ${userId}`,
      });
    }

    return res.status(200).json({ seller });
  } catch (err) {
    console.error("Error fetching seller profile:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching seller profile" });
  }
};

module.exports = {
  updateSellerProfile,
  handleChangePasswordOfSeller,
  getSellerProfile,
};
