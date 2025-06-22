const { Op } = require("sequelize");
const User = require("../../../models/authModel/userModel");
const Order = require('../../../models/orderModel/orderModel');
const Review = require('../../../models/reviewModel/reviewModel');
const Address = require('../../../models/orderModel/orderAddressModel');


const handleGetAllUsers = async (req, res) => {
  try {
    const { id, email, name, status } = req.query;

    const whereClause = {
      isVerified: true, 
    };

    if (id) {
      whereClause.id = id;
    }

    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }

    if (name) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${name}%` } },
        { lastName: { [Op.like]: `%${name}%` } },
      ];
    }

    if (status) {
      whereClause.status = status.toLowerCase();
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "canReview",
        "authProvider",
        "status",
        "isVerified",
        "createdAt",
      ],
    });

    res.status(200).json({
      message: "Verified users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'authProvider', 'status', 'createdAt'],
      include: [
        { model: Order, as: 'orders' },      // include user's orders
        { model: Review, as: 'reviews' },    // include user's reviews
        { model: Address, as: 'addresses' }  // include user's addresses
      ]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      message: 'User details retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Activate or deactivate a user by updating their status field
const handleUpdateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // e.g. 'active' or 'suspended'

    if (!["active", "suspended", "deleted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetUserOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: userId,
      }
     
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found for this user' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (error) {
    console.error('Error fetching user order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// 1. Get user details from orderId
const handleGetUserByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order including user info
    const order = await Order.findByPk(orderId, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'authProvider', 'status'],
        include: [
          { model: Order, as: 'orders' },
          { model: Review, as: 'reviews' },
          { model: Address, as: 'addresses' },
        ]
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.user) {
      return res.status(404).json({ error: 'User for this order not found' });
    }

    res.status(200).json({
      message: 'User details retrieved successfully from orderId',
      user: order.user,
    });
  } catch (error) {
    console.error('Error fetching user by orderId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Get user details by phone/contact number
const handleGetUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const user = await User.findOne({
      where: { phone },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'authProvider', 'status'],
      include: [
        { model: Order, as: 'orders' },
        { model: Review, as: 'reviews' },
        { model: Address, as: 'addresses' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this phone number' });
    }

    res.status(200).json({
      message: 'User details retrieved successfully by phone',
      user,
    });
  } catch (error) {
    console.error('Error fetching user by phone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const handleGetUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'authProvider', 'status'],
      include: [
        { model: Order, as: 'orders' },
        { model: Review, as: 'reviews' },
        { model: Address, as: 'addresses' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    res.status(200).json({
      message: 'User details retrieved successfully by email',
      user,
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  handleGetAllUsers,
  handleUpdateUserStatus,
  handleDeleteUser,
  handleGetUserDetails,
  handleGetUserOrderById ,
   handleGetUserByOrderId,
  handleGetUserByPhone,
  handleGetUserByEmail
};
