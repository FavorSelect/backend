const express = require("express");
const { handleGetAllPendingProducts, handleApproveProduct, handleRejectProduct } = require("../../../controllers/adminController/approval/approveProduct");

const router = express.Router();


router.get('/pending-products',handleGetAllPendingProducts)
router.patch('/pending-products/:productId/approve', handleApproveProduct);
router.patch('/pending-products/:productId/reject',handleRejectProduct);



module.exports = router;