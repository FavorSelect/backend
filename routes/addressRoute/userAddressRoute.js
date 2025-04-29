const express = require('express');
const { handleAddAddress, handleGetUserAddresses, handleUpdateAddress, handleDeleteAddress, handleSetDefaultAddress } = require('../../controllers/addressController/addressController');
const router = express.Router();
// All routes protected
router.post('/',handleAddAddress);
router.get('/',  handleGetUserAddresses);
router.put('/:addressId',  handleUpdateAddress);
router.delete('/:addressId', handleDeleteAddress);
router.patch('/:addressId/default', handleSetDefaultAddress);

module.exports = router;
