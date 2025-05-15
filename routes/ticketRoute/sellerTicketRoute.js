const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const { replyToTicketSeller, getAllTicketsSeller, getMyTicketsSeller, createSellerTicket } = require("../../controllers/ticketController/sellerTicketController");


// Seller raises ticket
router.post(
  "/seller/raise-ticket",
  checkForAuthenticationCookie("token"),
  createSellerTicket
);

// Seller views their own tickets
router.get("/seller/my-tickets", checkForAuthenticationCookie("token"), getMyTicketsSeller);

// Admin views all tickets
router.get(
  "/seller/admin/all-tickets",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  getAllTicketsSeller
);

// Admin replies to ticket
router.put(
  "/seller/admin/reply/:ticketId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  replyToTicketSeller
);

module.exports = router;
