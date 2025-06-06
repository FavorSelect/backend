const express = require("express");
const {
  handleGetOrderById,
  handleGetOrdersByUserId,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  handleUpdateShippingDates,
  handleDeleteOrder,
  handleSellerGetAllOrders,
  handleAdminGetAllOrders,
  handleGetOrderByUniqueOrderId,
  handleGetOrdersByUserEmail,
} = require("../../controllers/orderController/orderManagement");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");

router.get(
  "/seller/orders",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["seller"]),
  handleSellerGetAllOrders
);
router.get(
  "/admin/orders",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  handleAdminGetAllOrders
);
router.get(
  "/admin/orders/:orderId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  handleGetOrderById
);
router.get(
  "/seller/orders/:orderId",
  checkForAuthenticationCookie("token"),
  authorizeRoles([ "seller"]),
  handleGetOrderById
);
router.get(
  "/orders/user/unique/:uniqueOrderId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  handleGetOrderByUniqueOrderId
);

router.get(
  "/orders/user/email/:email",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  handleGetOrdersByUserEmail
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
