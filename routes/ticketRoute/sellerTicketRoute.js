const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const { replyToTicketSeller, getAllTicketsSeller, getMyTicketsSeller, createSellerTicket, getTicketByIdSeller } = require("../../controllers/ticketController/sellerTicketController");
const upload = require("../../awsS3Connection/awsUploadMiddleware");



router.post(
  "/seller/raise-ticket",
  checkForAuthenticationCookie("token"),
    authorizeRoles(["seller"]),
  upload.single('imageUrl'),
  createSellerTicket
);


router.get("/seller/my-tickets", checkForAuthenticationCookie("token"),  authorizeRoles(["seller"]), getMyTicketsSeller);


router.get(
  "/seller/admin/all-tickets",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  getAllTicketsSeller
);


router.get(
  "/seller/admin/all-tickets/:ticketId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
   getTicketByIdSeller
);


router.put(
  "/seller/admin/reply/:ticketId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  replyToTicketSeller
);

module.exports = router;
