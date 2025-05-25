const  Seller  = require("../models/authModel/sellerModel"); 

const checkSellerMembership = async (req, res, next) => {
  try {
       const userId = req.user.id; 
      const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    if (!seller.membershipId) {
      return res.status(403).json({ success: false, message: "No membership plan found" });
    }

    if (new Date(seller.membershipEnd) < new Date()) {
      return res.status(403).json({ success: false, message: "Membership plan has expired" });
    }

    next(); 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking membership",
      error: error.message,
    });
  }
};

module.exports = checkSellerMembership;
