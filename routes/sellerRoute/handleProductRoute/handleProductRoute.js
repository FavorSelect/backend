const express = require("express");
const { handleAddProduct } = require("../../../controllers/productController/productController");
const upload = require('../../../awsS3Connection/awsUploadMiddleware')
const router = express.Router();

router.post('/add-products',upload.single('coverImageURL'),handleAddProduct);


module.exports = router;