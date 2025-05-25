const {
  sendMembershipAssignedEmail,
  sendMembershipRenewalEmail,
} = require("../../emailService/sellerMembershipEmail/sellerMembershipEmail");
const Seller = require("../../models/authModel/sellerModel");
const Membership = require("../../models/membershipModel/sellerMembershipModel");

const handleAssignMembershipToSeller = async (req, res) => {
  const membershipId = req.params.membershipId;
  try {
    const userId = req.user.id;
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const membership = await Membership.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(membership.durationInDays));

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

    return res
      .status(200)
      .json({ message: "Membership assigned successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error assigning membership to seller",
      error: error.message,
    });
  }
};

const handleRenewSellerMembership = async (req, res) => {
  const {membershipId } = req.params;
  try {
     const userId = req.user.id; 
      const seller = await Seller.findOne({ where: { userId } });
    const membership = await Membership.findByPk(membershipId);

    if (!seller || !membership) {
      return res
        .status(404)
        .json({ success: false, message: "Seller or Membership not found" });
    }

    // Check if the current membership has expired
    const currentDate = new Date();
    if (seller.membershipEnd && new Date(seller.membershipEnd) > currentDate) {
      return res.status(400).json({
        success: false,
        message: "Membership is still active. No need to renew.",
      });
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

const handleGetAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      where: { isActive: true },
    });

    return res.status(200).json({ success: true, memberships });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving memberships",
      error: error.message,
    });
  }
};

const handleGetMembershipById = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const membership = await Membership.findByPk(membershipId);

    if (!membership || !membership.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found or inactive" });
    }

    return res.status(200).json({ success: true, membership });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving membership",
      error: error.message,
    });
  }
};
const getSellerMembershipStatus = async (req, res) => {
  try {
   
   const userId = req.user.id; 
      const seller = await Seller.findOne({ where: { userId }, include: ["Membership"], });
  
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const today = new Date();
    const expiryDate = new Date(seller.membershipEnd);

    const timeDiff = expiryDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let membershipStatus;
    if (daysLeft > 0) {
      membershipStatus = `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
    } else {
      membershipStatus = "Expired – Renew it";
    }

    res.status(200).json({
      sellerDetails: seller,
      membershipStatus,
    });
  } catch (error) {
    console.error("Error getting membership status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  handleRenewSellerMembership,
  handleAssignMembershipToSeller,
  handleGetAllMemberships,
  handleGetMembershipById,
  getSellerMembershipStatus,
};
