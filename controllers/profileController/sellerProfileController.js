const Seller = require('../../models/authModel/sellerModel') 
const {
  sendSellerProfileUpdateEmail,
  sendSellerChangePasswordEmail,
} = require("../../emailService/sellerAuthEmail/sellerAuthEmail");

const updateSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

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

    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Check if files are uploaded
    const fileURL = req.file?.location;

    // Update fields

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

    // Optional: update shop logo and documents if re-uploaded
    if (fileURL) {
      seller.shopLogo = fileURL;

      seller.taxDocument = fileURL;
    }

    await seller.save();
    await sendSellerProfileUpdateEmail(seller.email, seller.firstName);
    return res
      .status(200)
      .json({ message: "Seller profile updated successfully", seller });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating seller profile" });
  }
};
const handleChangePasswordOfSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedPassword;
    await seller.save();
    await sendSellerChangePasswordEmail(seller.email, seller.sellerName);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findByPk(sellerId, {
      attributes: {
        exclude: ["password", "verificationCode", "verificationCodeExpiresAt"],
      },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    return res.status(200).json({ seller });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
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
