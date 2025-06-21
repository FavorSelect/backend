const WarehouseAddress = require("../../models/deliveryModel/adminWarehouseAdd");


const addWarehouse = async (req, res) => {
  try {
    const data = await WarehouseAddress.create(req.body);
    res.status(201).json({ success: true, message: "Warehouse added", data });
  } catch (err) {
    console.error("Add warehouse error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await WarehouseAddress.findAll();
    res.json({ success: true, warehouses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await WarehouseAddress.findByPk(req.params.id);
    if (!warehouse)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await WarehouseAddress.findByPk(req.params.id);
    if (!warehouse)
      return res.status(404).json({ success: false, message: "Not found" });

    await warehouse.update(req.body);
    res.json({ success: true, message: "Warehouse updated", warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await WarehouseAddress.findByPk(req.params.id);
    if (!warehouse)
      return res.status(404).json({ success: false, message: "Not found" });

    await warehouse.destroy();
    res.json({ success: true, message: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
};
