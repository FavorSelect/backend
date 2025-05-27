const express = require("express");
const {
  submitDeletionRequest,
  getAllDeletionRequests,
  updateDeletionRequestStatus,
  getDeletionRequestStatus,
} = require("../../controllers/accountDeleteRequestController/accountDeleteController");
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const router = express.Router();

router.post(
  "/deletion-request",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user", "seller"]),
  submitDeletionRequest
);
router.get(
  "/account-deletion/status",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user", "seller"]),
  getDeletionRequestStatus
);

router.get(
  "/deletion-requests",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  getAllDeletionRequests
);
router.patch(
  "/deletion-request/:id/status",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  updateDeletionRequestStatus
);

module.exports = router;
