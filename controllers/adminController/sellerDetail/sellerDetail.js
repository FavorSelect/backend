const { Op } = require('sequelize');
const Seller = require('../../../models/authModel/sellerModel');

const handleGetAllSellers = async (req, res) => {
  try {
    const { status, isVerified, isApproved, businessType, city, state, country } = req.query;
    const whereClause = {};
    if (status) {
      whereClause.status = status.toLowerCase();
    }
    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified === 'true';
    }
    if (isApproved !== undefined) {
      whereClause.isApproved = isApproved === 'true';
    }
    if (businessType) {
      whereClause.businessType = businessType;
    }
    if (city) {
      whereClause.city = { [Op.like]: `%${city}%` };
    }
    if (state) {
      whereClause.city = { [Op.like]: `%${state}%` };
    }
    if (country) {
      whereClause.city = { [Op.like]: `%${country}%` };
    }
    const sellers = await Seller.findAll({ where: whereClause });
    res.status(200).json({
      message: 'Sellers retrieved successfully',
      count: sellers.length,
      sellers
    });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const handleUpdateSellerStatus = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;

    if (!["active", "suspended", "deactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const seller = await Seller.findByPk(sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    seller.status = status;
    await seller.save();

    res.status(200).json({ message: `Seller status updated to ${status}`, seller });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a seller
const handleDeleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findByPk(sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    await seller.destroy();

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get detailed info of a seller by ID
const handleGetSellerDetails = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findByPk(sellerId);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    res.status(200).json({ message: "Seller details retrieved successfully", seller });
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get seller by contact number
const handleGetSellerByContact = async (req, res) => {
  try {
    const { contact } = req.params;

    const seller = await Seller.findOne({ where: { contactNumber: contact } });

    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    res.status(200).json({ message: 'Seller found by contact number', seller });
  } catch (error) {
    console.error('Error fetching seller by contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get seller by membershipId
const handleGetSellerByMembershipId = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const seller = await Seller.findOne({ where: { membershipId } });

    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    res.status(200).json({ message: 'Seller found by membership ID', seller });
  } catch (error) {
    console.error('Error fetching seller by membershipId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get seller by email
const handleGetSellerByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const seller = await Seller.findOne({ where: { email } });

    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    res.status(200).json({ message: 'Seller found by email', seller });
  } catch (error) {
    console.error('Error fetching seller by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    handleGetAllSellers,
  handleUpdateSellerStatus,
  handleDeleteSeller,
  handleGetSellerDetails,
  handleGetSellerByContact,
  handleGetSellerByMembershipId,
  handleGetSellerByEmail,
};