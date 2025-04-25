const Seller =require('../../models/authModel/sellerModel')
const SellerAgreement = require('../../models/authModel/sellerAgreementModel')
const getPendingSellerAgreementApproval = async (req, res) => {
    try {
      const pendingSellerAgreement = await Seller.findAll({
        where: { isAgreementApproved: false }
      });
  
      if (pendingSellerAgreement.length === 0) {
        return res.status(404).json({ success: false, message: "No pending agreement approvals" });
      }
  
      res.status(200).json({ success: true,  pendingSellerAgreement });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };


const handleApproveSellerAgreement = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    seller. isAgreementApproved = true;
    await seller.save();
    await sendApprovedSellerAgreementEmail(seller.email, seller.sellerName); 

    res.status(200).json({ success: true, message: "Seller approved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const handleRejectSellerAgreement = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    const agreement = await SellerAgreement.findOne({ where: { sellerId } });

    if (!agreement) {
      return res.status(404).json({ success: false, message: "Seller agreement not found" });
    }

    await sendAgreementApprovalRejectEmail(seller.email, seller.sellerName);
    await agreement.destroy();

    res.status(200).json({ success: true, message: "Seller agreement rejected and deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
    handleRejectSellerAgreement ,
    handleApproveSellerAgreement,
    getPendingSellerAgreementApproval
}