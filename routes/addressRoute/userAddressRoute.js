const express = require('express');
const { handleAddAddress, handleGetUserAddresses, handleUpdateAddress, handleDeleteAddress, handleSetDefaultAddress } = require('../../controllers/addressController/addressController');
const router = express.Router();

// All routes protected
router.post('/address/add',handleAddAddress);
router.get('/address',  handleGetUserAddresses);
router.put('/address/:addressId',  handleUpdateAddress);
router.delete('/address/:addressId', handleDeleteAddress);
router.patch('/address/:addressId/default', handleSetDefaultAddress);

module.exports = router;
