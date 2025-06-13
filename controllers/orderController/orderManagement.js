const { Op } = require("sequelize");
const Order = require("../../models/orderModel/orderModel");
const User = require("../../models/authModel/userModel");
const OrderItem = require("../../models/orderModel/orderItemModel");
const Product = require("../../models/productModel/productModel");
const Cart = require("../../models/cartModel/cartModel");
const CartItem = require("../../models/cartModel/cartItemModel");
const Address = require("../../models/orderModel/orderAddressModel");
const Payment = require("../../models/paymentModel/paymentModel");
const Seller = require("../../models/authModel/sellerModel");
const { createUserNotification } = require("../notifications/userNotification");

const handleAdminGetAllOrders = async (req, res) => {
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
    });

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const handleSellerGetAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res
        .status(404)
        .json({ message: "Seller not found for this user" });
    }

    const sellerId = seller.id;
    const { orderStatus, paymentStatus, paymentMethod, startDate, endDate } =
      req.query;

    const whereClause = {};
    if (orderStatus) whereClause.orderStatus = orderStatus;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      whereClause.orderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }
    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",

              attributes: ["id", "productName", "sellerId", "productPrice"],
            },
          ],
        },
        {
          model: Cart,
          include: [
            {
              model: CartItem,
              include: [
                {
                  model: Product,
                  attributes: [
                    "id",
                    "productName",
                    "productPrice",
                    "coverImageUrl",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "firstName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "createdAt",
        "updatedAt",
      ],
    });
    const filteredOrders = orders.filter((order) =>
      order.orderItems.some((item) => item.product.sellerId === sellerId)
    );

    return res.status(200).json({
      message: "Orders retrieved for seller",
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    console.error("Error getting seller-specific orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "email"],
        },
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "productName",
                "productPrice",
                "coverImageUrl",
              ],
            },
          ],
        },
        {
          model: Payment,
          attributes: ["id", "paymentMethod", "paymentStatus", "paymentDate"],
        },
        {
          model: Cart,
          include: [
            {
              model: CartItem,
              include: [
                {
                  model: Product,
                  attributes: [
                    "id",
                    "productName",
                    "productPrice",
                    "coverImageUrl",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Address,
          as: "shippingAddress",
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Error getting order by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetOrderByUniqueOrderId = async (req, res) => {
  try {
    const { uniqueOrderId } = req.params;

    const order = await Order.findOne({
      where: { uniqueOrderId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "sellerId", "productPrice"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "firstName", "email"],
        },
      ],
       order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order retrieved", order });
  } catch (error) {
    console.error("Error getting order by uniqueOrderId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetOrdersByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  

    const orders = await Order.findAll({
      where: { userId: user.id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "sellerId", "productPrice"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "createdAt",
        "updatedAt",
      ],
    });

    res.status(200).json({
      message: "Orders retrieved",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error getting orders by user email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const handleUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    if (orderStatus === "Delivered") {
      const user = await User.findByPk(order.userId);
      if (user) {
        await createUserNotification({
          userId: user.id,
          title: "Order Delivered",
          message: `Your order ${order.uniqueOrderId} has been delivered. Thank you for shopping with us!`,
          type: "order",
          coverImage: null, 
        });
      }
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleUpdatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.paymentStatus = paymentStatus;
    await order.save();
    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleUpdateShippingDates = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shippingDate, deliveryDate } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (shippingDate) order.shippingDate = shippingDate;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    await order.save();

    res.status(200).json({ message: "Shipping/delivery dates updated", order });
  } catch (error) {
    console.error("Error updating shipping dates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleDeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.destroy();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleAdminGetAllOrders,
  handleSellerGetAllOrders,
  handleGetOrderById,
   handleGetOrdersByUserEmail ,
 handleGetOrderByUniqueOrderId,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  handleUpdateShippingDates,
  handleDeleteOrder,
};
