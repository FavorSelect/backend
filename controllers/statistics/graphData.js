const { Op } = require("sequelize");
const Order = require("../../models/orderModel/orderModel");
const Product = require("../../models/productModel/productModel");
const OrderItem = require("../../models/orderModel/orderItemModel");
const Category = require("../../models/categoryModel/categoryModel");


const getRevenueOverTime = async (req, res) => {
  try {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];  

    const currentYear = new Date().getFullYear();
    const revenueData = await Promise.all(
      months.map(async (month, index) => {
        const start = new Date(currentYear, index, 1);
        const end = new Date(currentYear, index + 1, 1);

        const orders = await Order.findAll({
          where: {
            orderDate: {
              [Op.gte]: start,
              [Op.lt]: end,
            },
            orderStatus: "Delivered",
          },
          attributes: ["totalAmount"],
        });

        const monthlyRevenue = orders.reduce(
          (sum, order) => sum + Number(order.totalAmount || 0),
          0
        );

        return { month, revenue: monthlyRevenue };
      })
    );

    const totalRevenue = revenueData.reduce((sum, m) => sum + m.revenue, 0);

    const currentMonthIndex = new Date().getMonth();
    const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

    const lastMonthRevenue = revenueData[lastMonthIndex]?.revenue || 0;
    const currentMonthRevenue = revenueData[currentMonthIndex]?.revenue || 0;

    let percentageChange = "N/A";
    if (lastMonthRevenue > 0) {
      percentageChange = (
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      ).toFixed(2);
    }

    res.status(200).json({
      totalRevenue,
      percentageChange,
      revenueOverTime: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrdersByCategory = async (req, res) => {
  try {
    const items = await OrderItem.findAll({
      include: {
        model: Product,
        as: "product",
        include: {
          model: Category,
          as: "category",
          attributes: ["categoryName"]
        },
      },
    });

    const categoryCount = {};

    items.forEach((item) => {
      const category = item.product?.category?.categoryName || "Other";
      categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
    });

    const chartData = Object.entries(categoryCount).map(([category, orders]) => ({
      category,
      orders,
    }));

    const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);

    res.status(200).json({
      totalOrders,
      ordersByCategory: chartData,
    });
  } catch (error) {
    console.error("Error fetching category orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRevenueOverTime,
  getOrdersByCategory,
};
