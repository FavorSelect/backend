const express = require('express');
const { handleCreateCategory, handleGetAllCategories, handleGetCategoryById, handleUpdateCategory, handleDeleteCategory } = require('../../controllers/categoryController/categoryController');
const router = express.Router();
router.post('/categories',  handleCreateCategory );
router.get('/categories', handleGetAllCategories);
router.get('/categories/:categoryId', handleGetCategoryById);
router.patch('/categories/:categoryId', handleUpdateCategory);
router.delete('/categories/:categoryId',   handleDeleteCategory);

module.exports = router;
