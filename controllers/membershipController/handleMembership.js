const Membership = require('../../models/membershipModel/sellerMembershipModel')

const handleCreateMembership = async (req, res) => {
    const { planName, durationInDays, price, description, isActive = true } = req.body;
    
    try {
      const newMembership = await Membership.create({
        planName,
        durationInDays,
        price,
        description,
        isActive
      });
  
      return res.status(201).json({ success: true, message: 'Membership created successfully', membership: newMembership });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error creating membership', error: error.message });
    }
  };


const handleUpdateMembership = async (req, res) => {
  const { membershipId } = req.params;
  const { planName, price, description, isActive,durationInDays } = req.body;

  try {
    const membership = await Membership.findByPk(membershipId);

    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    await membership.update({ planName, price, description, isActive ,durationInDays});

    return res.status(200).json({ success: true, message: 'Membership updated successfully', membership });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating membership', error: error.message });
  }
};

const handleDeleteMembership = async (req, res) => {
  const { membershipId } = req.params;

  try {
    const membership = await Membership.findByPk(membershipId);

    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    await membership.destroy();

    return res.status(200).json({ success: true, message: 'Membership deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting membership', error: error.message });
  }
};

const handleDeleteSellerMembership = async (req, res) => {
  try {
    const { sellerId } = req.params; 
    const seller = await Seller.findByPk(sellerId); 

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (!seller.membershipId) {
      return res.status(400).json({ success: false, message: "No membership found for this seller" });
    }

    // Find the associated membership
    const membership = await Membership.findByPk(seller.membershipId);

    if (!membership) {
      return res.status(404).json({ success: false, message: "Membership not found" });
    }

    // Remove membership from the seller (unassign it)
    seller.membershipId = null;
    seller.membershipStart = null;
    seller.membershipEnd = null;
    
    await seller.save(); 


    return res.status(200).json({
      success: true,
      message: "Membership deleted successfully from seller",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting membership from seller",
      error: error.message,
    });
  }
};

module.exports = {
    handleDeleteMembership,
    handleUpdateMembership,
    handleCreateMembership,
    handleDeleteSellerMembership

};
