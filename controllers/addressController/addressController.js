const Address = require("../../models/orderModel/orderAddressModel");
const { sequelize } = require("../../mysqlConnection/dbConnection"); // for transactions

const handleAddAddress = async (req, res) => {
  const {
    recipientName,
    street,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
    type,
    isDefault,
  } = req.body;

  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId }, transaction: t }
      );
    }

    const newAddress = await Address.create(
      {
        userId,
        recipientName,
        street,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        type,
        isDefault: !!isDefault,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    await t.rollback();
    console.error("Add Address Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while adding address",
        error: error.message,
      });
  }
};

const handleGetUserAddresses = async (req, res) => {
  const userId = req.user.id;

  try {
    const addresses = await Address.findAll({
      where: { userId },
      order: [["isDefault", "DESC"]],
    });

    res.status(200).json({ success: true,message:"user address added successfult", addresses });
  } catch (error) {
    console.error("Get Addresses Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching addresses",
        error: error.message,
      });
  }
};

const handleUpdateAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;
  const {
    recipientName,
    street,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
    type,
    isDefault,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (isDefault === true) {
      await Address.update({ isDefault: false }, { where: { userId }, transaction: t });
    }

    await address.update(
      {
        recipientName,
        street,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        type,
        isDefault,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({ success: true, address });
  } catch (error) {
    await t.rollback();
    console.error('Update Address Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating address', error: error.message });
  }
};

// Delete an address
const handleDeleteAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;

  try {
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    await address.destroy();
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while deleting address",
        error: error.message,
      });
  }
};

const handleSetDefaultAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    // Reset all addresses to non-default for this user
    await Address.update(
      { isDefault: false },
      { where: { userId }, transaction: t }
    );
    // Find the address to set as default
    const address = await Address.findOne({
      where: { id: addressId, userId },
      transaction: t,
    });
    if (!address) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    await address.update({ isDefault: true }, { transaction: t });
    await t.commit();

    res
      .status(200)
      .json({ success: true, message: "Address marked as default", address });
  } catch (error) {
    await t.rollback();
    console.error("Set Default Address Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while setting default address",
        error: error.message,
      });
  }
};

module.exports = {
  handleAddAddress,
  handleGetUserAddresses,
  handleUpdateAddress,
  handleDeleteAddress,
  handleSetDefaultAddress,
};
