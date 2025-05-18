const express = require("express");
const router = express.Router();

const upload = require("../../../awsS3Connection/awsUploadMiddleware");
const { handleAddCategory, handleUpdateCategory, handleDeleteCategory } = require("../../../controllers/categoryController/categoryController");


router.post(
  "/categories/create-categories",
  upload.single("categoryImage"),
  handleAddCategory
);
router.patch(
  "/categories/:categoryId",
  upload.single("categoryImage"),
  handleUpdateCategory
);
router.delete("/categories/:categoryId", handleDeleteCategory);
module.exports = router;
