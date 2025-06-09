const { Op } = require("sequelize");
const User = require("../../models/authModel/userModel");
const OrderItem = require("../../models/orderModel/orderItemModel");
const Order = require("../../models/orderModel/orderModel");
const UserTicket = require("../../models/ticketModel/userTicketModel");
const SellerTicket = require("../../models/ticketModel/sellerTicket");
const Seller = require("../../models/authModel/sellerModel");

const handleGetRecentUsers = async (req, res) => {
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
        "authProvider",
        "status",
        "isVerified",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]], 
      limit: 3, 
    });

    res.status(200).json({
      message: "Latest 3 verified users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleAdminLatestOrders = async (req, res) => {
  try {
    const { orderStatus, uniqueOrderId, orderDate } = req.query;

    const whereClause = {};

    if (orderStatus) {
      whereClause.orderStatus = orderStatus;
    }

    if (uniqueOrderId) {
      whereClause.uniqueOrderId = {
        [Op.like]: `%${uniqueOrderId}%`,
      };
    }

    if (orderDate) {
      const date = new Date(orderDate);
      whereClause.orderDate = {
        [Op.gte]: new Date(date.setHours(0, 0, 0, 0)),
        [Op.lt]: new Date(date.setHours(24, 0, 0, 0)),
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [
            "productId",
            "productName",
            "quantity",
            "price",
            "totalPrice",
            "productImageUrl",
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
      limit: 3, 
    });

    res.status(200).json({
      message: "Latest 3 orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLatestCombinedLatestTickets = async (req, res) => {
  try {
    const { status } = req.query;

    const userWhere = status ? { status } : {};
    const sellerWhere = status ? { status } : {};

    const [userTickets, sellerTickets] = await Promise.all([
      UserTicket.findAll({
        where: userWhere,
        attributes: [
          "id",
          "ticketNumber",
          "subject",
          "description",
          "status",
          "adminReply",
          "image",
          "createdAt",
        ],
        include: {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
        },
      }),
      SellerTicket.findAll({
        where: sellerWhere,
        attributes: [
          "id",
          "ticketNumber",
          "subject",
          "description",
          "status",
          "adminReply",
          "imageUrl",
          "createdAt",
        ],
        include: {
          model: Seller,
          attributes: ["id", "sellerName", "email", "contactNumber"],
        },
      }),
    ]);

    const normalizedUserTickets = userTickets.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      adminReply: ticket.adminReply,
      image: ticket.image,
      createdAt: ticket.createdAt,
      type: "user",
      userInfo: ticket.User,
    }));

    const normalizedSellerTickets = sellerTickets.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      adminReply: ticket.adminReply,
      image: ticket.imageUrl,
      createdAt: ticket.createdAt,
      type: "seller",
      sellerInfo: ticket.Seller,
    }));

    const combinedTickets = [...normalizedUserTickets, ...normalizedSellerTickets]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    res.status(200).json({
      message: "Latest 3 tickets retrieved successfully",
      tickets: combinedTickets,
    });
  } catch (error) {
    console.error("Error fetching combined tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};



module.exports = {
    handleGetRecentUsers,
    handleAdminLatestOrders,
    getLatestCombinedLatestTickets
}
