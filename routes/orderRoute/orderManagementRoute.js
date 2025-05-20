const express = require("express");
const {
  handleGetAllOrders,
  handleGetOrderById,
  handleGetOrdersByUserId,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  handleUpdateShippingDates,
  handleDeleteOrder,
} = require("../../controllers/orderController/orderManagement");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");

router.get(
  "/orders",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin","admin+", "superadmin","seller"]),
  handleGetAllOrders
);
router.get(
  "/orders/:orderId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin", "seller"]),
  handleGetOrderById
);
router.get(
  "/users/:userId/orders",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin", "seller"]),
  handleGetOrdersByUserId
);
router.patch(
  "/orders/:orderId/order-status",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin", "seller"]),
  handleUpdateOrderStatus
);
router.patch(
  "/orders/:orderId/payment-status",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  handleUpdatePaymentStatus
);
router.patch(
  "/orders/:orderId/shipping-dates",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin", "seller"]),
  handleUpdateShippingDates
);
router.delete(
  "/orders/:orderId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin", "seller"]),
  handleDeleteOrder
);

module.exports = router;
