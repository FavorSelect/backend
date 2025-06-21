const express = require("express");
const { addWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse } = require("../../controllers/deliveryController/adminWarehouseAdd");
const router = express.Router();

router.post("/warehouse-add/add", addWarehouse);
router.get("/warehouse-add/all", getAllWarehouses);
router.get("/warehouse-add/:id", getWarehouseById);
router.put("/warehouse-add/:id", updateWarehouse);
router.delete("/warehouse-add/:id", deleteWarehouse);

module.exports = router;
