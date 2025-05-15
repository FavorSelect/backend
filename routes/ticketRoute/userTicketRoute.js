const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyToTicket,
} = require("../../controllers/ticketController/userTicketController");

// User raises ticket
router.post(
  "/raise-ticket",
  checkForAuthenticationCookie("token"),
  createTicket
);

// User views their own tickets
router.get("/my-tickets", checkForAuthenticationCookie("token"), getMyTickets);

// Admin views all tickets
router.get(
  "/admin/all-tickets",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  getAllTickets
);

// Admin replies to ticket
router.put(
  "/admin/reply/:ticketId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  replyToTicket
);

module.exports = router;
