const { Op } = require("sequelize");
const Order = require("../../models/orderModel/orderModel");
const User = require("../../models/authModel/userModel");

// 1. Get all orders with optional filters
const handleGetAllOrders = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, paymentMethod, startDate, endDate } = req.query;
    const whereClause = {};

    if (orderStatus) whereClause.orderStatus = orderStatus;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      whereClause.orderDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const orders = await Order.findAll({ where: whereClause });
    res.status(200).json({ message: "Orders retrieved", count: orders.length, orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// //  1. Get all orders (optional filters – full control)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     res.status(200).json({ message: "All orders retrieved", count: orders.length, orders });
//   } catch (error) {
//     console.error("Error getting all orders:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // 2. Get orders by orderStatus
// const getOrdersByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const orders = await Order.findAll({ where: { orderStatus: status } });
//     res.status(200).json({ message: "Orders retrieved by status", count: orders.length, orders });
//   } catch (error) {
//     console.error("Error getting orders by status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// //  3. Get orders by paymentStatus
// const getOrdersByPaymentStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const orders = await Order.findAll({ where: { paymentStatus: status } });
//     res.status(200).json({ message: "Orders retrieved by payment status", count: orders.length, orders });
//   } catch (error) {
//     console.error("Error getting orders by payment status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// //  4. Get orders by paymentMethod
// const getOrdersByPaymentMethod = async (req, res) => {
//   try {
//     const { method } = req.params;
//     const orders = await Order.findAll({ where: { paymentMethod: method } });
//     res.status(200).json({ message: "Orders retrieved by payment method", count: orders.length, orders });
//   } catch (error) {
//     console.error("Error getting orders by payment method:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // 5. Get orders by date range
// const getOrdersByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     if (!startDate || !endDate) {
//       return res.status(400).json({ error: "startDate and endDate are required." });
//     }

//     const orders = await Order.findAll({
//       where: {
//         orderDate: {
//           [Op.between]: [new Date(startDate), new Date(endDate)],
//         },
//       },
//     });

//     res.status(200).json({ message: "Orders retrieved by date range", count: orders.length, orders });
//   } catch (error) {
//     console.error("Error getting orders by date range:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// 2. Get order by ID
const handleGetOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order retrieved", order });
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. Get orders by user ID
const handleGetOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({ where: { userId } });
    res.status(200).json({ message: "Orders retrieved", count: orders.length, orders });
  } catch (error) {
    console.error("Error getting orders by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Update order status
const handleUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 5. Update payment status
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

// 6. Update shipping and delivery dates
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

// 7. Delete (cancel) order
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
  handleGetAllOrders,
  handleGetOrderById,
  handleGetOrdersByUserId,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  handleUpdateShippingDates,
  handleDeleteOrder,
};
