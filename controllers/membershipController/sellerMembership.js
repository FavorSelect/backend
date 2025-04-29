const Seller = require('../../models/authModel/sellerModel');
const Membership  = require('../../models/membershipModel/sellerMembershipModel');

const handleAssignMembershipToSeller = async (req, res) => {
    const { planName, durationInDays } = req.body;
    const sellerId = req.user.id; 
  
    try {
      const seller = await Seller.findByPk(sellerId);
  
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const membership = await Membership.findOne({ where: { planName, durationInDays } });
  
      if (!membership) {
        return res.status(404).json({ message: 'Membership plan not found' });
      }
  
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(durationInDays));
  
      seller.membershipId = membership.id;
      seller.membershipStart = startDate;
      seller.membershipEnd = endDate;
  
      await seller.save();
      await sendMembershipAssignedEmail(
        seller.email,
        seller.sellerName,
        membership.planName,
        startDate,
        endDate
      );
  
      return res.status(200).json({ message: 'Membership assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: "Error assigning membership to seller", error: error.message });
    }
};


const handleRenewSellerMembership = async (req, res) => {
    const { sellerId, membershipId } = req.params;
    try {
     
      const seller = await Seller.findByPk(sellerId);
      const membership = await Membership.findByPk(membershipId);
  
      if (!seller || !membership) {
        return res.status(404).json({ success: false, message: "Seller or Membership not found" });
      }
  
      // Check if the current membership has expired
      const currentDate = new Date();
      if (seller.membershipEnd && new Date(seller.membershipEnd) > currentDate) {
        return res.status(400).json({ success: false, message: "Membership is still active. No need to renew." });
      }
  
      // Calculate the new membership start and end dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(membership.durationInDays));
  
      // Update seller's membership details
      seller.membershipId = membershipId;
      seller.membershipStart = startDate;
      seller.membershipEnd = endDate;
  
      // Save the updated seller record
      await seller.save();
  
      await sendMembershipRenewalEmail(
        seller.email,
        seller.sellerName,
        membership.planName,
        startDate,
        endDate
      );

      return res.status(200).json({
        success: true,
        message: "Membership renewed successfully",
        seller,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error renewing membership",
        error: error.message,
      });
    }
};




module.exports = {
    handleRenewSellerMembership,
    handleAssignMembershipToSeller,
}
