const express = require("express");
const router = express.Router();
const upload = require('../../awsS3Connection/awsUploadMiddleware')
const { handleImageSearch } = require("../../controllers/imageSearchController/imageSearch");


router.post("/image-search", upload.single("image"), handleImageSearch);

module.exports = router;
