const { sendApprovedEmail, sendApprovalRejectEmail } = require('../../../emailService/sellerAuthEmail/sellerAuthEmail');
const Seller  = require('../../../models/authModel/sellerModel');

const getPendingSellerApproval = async (req, res) => {
    try {
      const pendingSellers = await Seller.findAll({
        where: { isApproved: false }
      });
      if (pendingSellers.length === 0) {
        return res.status(404).json({ success: false, message: "No pending approvals" });
      }
      res.status(200).json({ success: true,pendingSellers });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };

  const getPendingSellerDetailsById = async (req, res) => {
  try {
    const { sellerId  } = req.params;

    const seller = await Seller.findOne({
      where: {
       id: sellerId,
        isApproved: false
      }
    });

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found or already approved" });
    }

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const handleApproveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    seller.isApproved = true;
    await seller.save();
    await sendApprovedEmail(seller.email, seller.sellerName); 

    res.status(200).json({ success: true, message: "Seller approved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleRejectSeller = async (req, res) => {
  try {
    const { adminId: sellerId } = req.params;
    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    await sendApprovalRejectEmail(seller.email, seller.sellerName);
    await seller.destroy();

    res.status(200).json({ success: true, message: "Seller request rejected successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
    handleRejectSeller,
    handleApproveSeller,
    getPendingSellerApproval,
    getPendingSellerDetailsById
}

