const AdminStats = require("../../models/statistic/adminaDashboard");

function calculatePercentage(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

const updateRevenueAndOrders = async (orderAmount) => {
  try {
    const existingStats = await AdminStats.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (existingStats) {
      const prevRevenue = existingStats.totalRevenue;
      const prevOrders = existingStats.totalOrders;

      const newRevenue = prevRevenue + orderAmount;
      const newOrders = prevOrders + 1;

      const revenuePercent = calculatePercentage(newRevenue, prevRevenue);
      const ordersPercent = calculatePercentage(newOrders, prevOrders);

      await existingStats.update({
        totalRevenue: newRevenue,
        totalRevenuePercentage: revenuePercent,
        totalOrders: newOrders,
        totalOrdersPercentage: ordersPercent,
      });

      console.log("AdminStats updated successfully (existing record)");
    } else {
      await AdminStats.create({
        totalRevenue: orderAmount,
        totalRevenuePercentage: 0,
        totalOrders: 1,
        totalOrdersPercentage: 0,
        totalCustomers: 0,
        totalCustomersPercentage: 0,
      });

      console.log("AdminStats created successfully (new record)");
    }
  } catch (err) {
    console.error("Failed to update/create AdminStats:", err);
  }
};


const updateCustomers = async () => {
  try {
    const existingStats = await AdminStats.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (existingStats) {
      const prevCustomers = existingStats.totalCustomers;
      const newCustomers = prevCustomers + 1;
      const customersPercent = calculatePercentage(newCustomers, prevCustomers);

      await existingStats.update({
        totalCustomers: newCustomers,
        totalCustomersPercentage: customersPercent,
      });

      console.log("AdminStats customer count updated (existing record)");
    } else {
      await AdminStats.create({
        totalCustomers: 1,
        totalCustomersPercentage: 0,
        totalRevenue: 0,
        totalRevenuePercentage: 0,
        totalOrders: 0,
        totalOrdersPercentage: 0,
      });

      console.log("AdminStats created successfully (new record)");
    }
  } catch (err) {
    console.error("Failed to update/create customers:", err);
  }
};


const getAllAdminStats = async (req, res) => {
  try {
    const stats = await AdminStats.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Failed to get AdminStats:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  updateRevenueAndOrders,
  updateCustomers,
   getAllAdminStats,
};
