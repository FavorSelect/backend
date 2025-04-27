const express = require('express');
const router = express.Router();
router.post('/categories',  createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:categoryId', getCategoryById);
router.patch('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId',  deleteCategory);

module.exports = router;
