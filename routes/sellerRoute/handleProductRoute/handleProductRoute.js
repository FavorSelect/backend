const express = require("express");
const { handleAddProduct, handleUpdateProduct, handleDeleteProduct } = require("../../../controllers/productController/productController");
const upload = require('../../../awsS3Connection/awsUploadMiddleware')
const router = express.Router();

router.post('/add-products',upload.single('coverImageURL'),handleAddProduct);
router.put('/update-product/:productId',upload.single('coverImageURL'), handleUpdateProduct);
router.delete('/delete-product', handleDeleteProduct);


module.exports = router;