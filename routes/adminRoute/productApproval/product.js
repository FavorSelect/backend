const express = require("express");
const { handleRejectProduct, handleApproveProduct, handleGetAllPendingProducts } = require("../../../controllers/adminController/approveProduct");
const router = express.Router();


router.get('/pending-products',handleGetAllPendingProducts)
router.patch('/pending-products/:productId/approve', handleApproveProduct);
router.patch('/pending-products/:productId/reject',handleRejectProduct);



module.exports = router;