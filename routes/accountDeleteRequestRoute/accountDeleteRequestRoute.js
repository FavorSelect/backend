const express = require("express");
const {
  submitDeletionRequest,
  getAllDeletionRequests,
  updateDeletionRequestStatus,
  getDeletionRequestStatus,
  getDeletionRequestById,
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
router.get(
  "/deletion-requests/:id",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
 getDeletionRequestById
);
router.patch(
  "/deletion-requests/:id",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  updateDeletionRequestStatus
);

module.exports = router;
