const AccountDeletionRequest = require("../../models/accountDeleteRequestModel/accountDeletionRequest");
const User = require("../../models/authModel/userModel");
const Seller = require("../../models/authModel/sellerModel");
const {
  sendAccountDeletionStatusEmail,
} = require("../../emailService/deletionRequest/deletionRequest");

const reasons = [
  "Concerned about data privacy and security",
  "Transitioning to a different shopping platform",
  "Receiving excessive emails or promotional content",
  "No longer finding the platform relevant or useful",
  "Dissatisfied with customer support experience",
  "Encountering unresolved technical issues",
  "Product pricing does not meet expectations",
  "Found a platform that better suits my needs",
  "Creating a new account for business or personal use",
  "Other (please specify)",
];

const generateUniqueId = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};
const submitDeletionRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!reasons.includes(reason)) {
      return res.status(400).json({ message: "Invalid reason selected" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const seller = await Seller.findOne({ where: { userId } });

    let uniqueId;
    let exists = true;
    while (exists) {
      uniqueId = generateUniqueId();
      const existing = await AccountDeletionRequest.findOne({
        where: { uniqueAccountDeletedId: uniqueId },
      });
      exists = !!existing;
      if (exists)
        console.log(" Unique ID already exists, regenerating:", uniqueId);
    }

    const request = await AccountDeletionRequest.create({
      userId,
      sellerId: seller ? seller.id : null,
      reason,
      uniqueAccountDeletedId: uniqueId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Account deletion request submitted",
      request,
    });
  } catch (error) {
    console.error(" Error in submitDeletionRequest:", error);
    return res.status(500).json({
      message: "Error submitting request",
      error: error.message,
    });
  }
};

const getDeletionRequestStatus = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const request = await AccountDeletionRequest.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueAccountDeletedId",
        "status",
        "reason",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "No account deletion request found" });
    }

    return res.status(200).json({
      message: "Account deletion request found",
      request,
    });
  } catch (error) {
    console.error("Error fetching deletion request:", error);
    return res.status(500).json({
      message: "Error fetching deletion request",
      error: error.message,
    });
  }
};

const getDeletionRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await AccountDeletionRequest.findOne({
      where: { id },
      attributes: [
        "id",
        "userId",
        "sellerId",
        "reason",
        "status",
        "uniqueAccountDeletedId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          required: false,
        },
        {
          model: Seller,
          attributes: ["id", "sellerName", "email", "shopName"],
          required: false,
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Deletion request not found" });
    }

    res.status(200).json({ request });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching deletion request",
      error: error.message,
    });
  }
};

const getAllDeletionRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {};

    const requests = await AccountDeletionRequest.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "userId",
        "sellerId",
        "reason",
        "status",
        "uniqueAccountDeletedId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          required: false,
        },
        {
          model: Seller,
          attributes: ["id", "sellerName", "email", "shopName"],
          required: false,
        },
      ],
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching deletion requests",
      error: error.message,
    });
  }
};

const updateDeletionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await AccountDeletionRequest.findByPk(id);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Account deletion request not found" });
    }

    let email = null;
    let fullName = null;

    if (status === "approved") {
      if (request.userId) {
        const user = await User.findByPk(request.userId);
        if (user) {
          request.deletedUserEmail = user.email;
          request.deletedUserName = `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim();

          email = user.email;
          fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

          await user.destroy();
        }
      }

      if (request.sellerId) {
        const seller = await Seller.findByPk(request.sellerId);
        if (seller) {
          request.deletedSellerEmail = seller.email;
          request.deletedSellerName = seller.sellerName || "";

          email = seller.email;
          fullName = seller.sellerName || "";

          await seller.destroy();
        }
      }
    }
    if (status === "rejected") {
      return res.status(200).json({
        message: "Request rejected, no account deleted",
        request,
      });
    }

    request.status = status;
    await request.save();

    if (email && fullName) {
      await sendAccountDeletionStatusEmail(
        email,
        fullName,
        request.uniqueAccountDeletedId,
        request.status
      );
    }

    res
      .status(200)
      .json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating deletion request",
      error: error.message,
    });
  }
};

module.exports = {
  updateDeletionRequestStatus,
  submitDeletionRequest,
  getAllDeletionRequests,
  getDeletionRequestStatus,
  getDeletionRequestById,
};
