const Address = require('../../models/orderModel/orderAddressModel');

const handleAddAddress = async (req, res) => {
  const { recipientName, street, city, state, postalCode, country, phoneNumber, type, isDefault } = req.body;
  const userId = req.user.id; 
  
  try {
    if (isDefault) {
      // Make all previous addresses isDefault: false
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await Address.create({
      userId,
      recipientName,
      street,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      type,
      isDefault: isDefault || false,
    });

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Add Address Error:", error);
    res.status(500).json({ success: false, message: "Server error while adding address", error: error.message });
  }
};


const handleGetUserAddresses = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const addresses = await Address.findAll({ where: { userId }, order: [['isDefault', 'DESC']] });
      res.status(200).json({ success: true, addresses });
    } catch (error) {
      console.error("Get Addresses Error:", error);
      res.status(500).json({ success: false, message: "Server error while fetching addresses", error: error.message });
    }
  };

  const handleUpdateAddress = async (req, res) => {
    const { addressId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
  
    try {
      const address = await Address.findOne({ where: { id: addressId, userId } });
  
      if (!address) {
        return res.status(404).json({ success: false, message: "Address not found" });
      }
  
      await address.update(updateData);
  
      res.status(200).json({ success: true, address });
    } catch (error) {
      console.error("Update Address Error:", error);
      res.status(500).json({ success: false, message: "Server error while updating address", error: error.message });
    }
  };

  const handleDeleteAddress = async (req, res) => {
    const { addressId } = req.params;
    const userId = req.user.id;
  
    try {
      const address = await Address.findOne({ where: { id: addressId, userId } });
  
      if (!address) {
        return res.status(404).json({ success: false, message: "Address not found" });
      }
  
      await address.destroy();
  
      res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
      console.error("Delete Address Error:", error);
      res.status(500).json({ success: false, message: "Server error while deleting address", error: error.message });
    }
  };

  const handleSetDefaultAddress = async (req, res) => {
    const { addressId } = req.params;
    const userId = req.user.id;
  
    try {
      // First, set all user's addresses as non-default
      await Address.update({ isDefault: false }, { where: { userId } });
  
      // Then, set this one as default
      const address = await Address.findOne({ where: { id: addressId, userId } });
  
      if (!address) {
        return res.status(404).json({ success: false, message: "Address not found" });
      }
  
      await address.update({ isDefault: true });
  
      res.status(200).json({ success: true, message: "Address marked as default", address });
    } catch (error) {
      console.error("Set Default Address Error:", error);
      res.status(500).json({ success: false, message: "Server error while setting default address", error: error.message });
    }
  };
  

  module.exports = {
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleUpdateAddress,
    handleGetUserAddresses ,
    handleAddAddress
  }