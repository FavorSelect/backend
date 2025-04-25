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
  const { planName, price, description, isActive } = req.body;

  try {
    const membership = await Membership.findByPk(membershipId);

    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    await membership.update({ planName, price, description, isActive });

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

const handleGetAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      where: { isActive: true }, 
    });

    return res.status(200).json({ success: true, memberships });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving memberships', error: error.message });
  }
};

module.exports = {
    handleGetAllMemberships,
    handleDeleteMembership,
    handleUpdateMembership,
    handleCreateMembership

};
