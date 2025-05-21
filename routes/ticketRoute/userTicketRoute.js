const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const {
  replyToTicketUser,
  getAllTicketsUser,
  getMyTicketsUser,
  createUserTicket,
} = require("../../controllers/ticketController/userTicketController");
const upload = require("../../awsS3Connection/awsUploadMiddleware");

router.post(
  "/user/raise-ticket",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user"]),
  upload.single("image"),
  createUserTicket
);

router.get(
  "/user/my-tickets",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user"]),
  getMyTicketsUser
);

router.get(
  "/user/admin/all-tickets",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  getAllTicketsUser
);

router.put(
  "/user/admin/reply/:ticketId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  replyToTicketUser
);

module.exports = router;
