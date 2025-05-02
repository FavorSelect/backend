const Category = require('../../models/categoryModel/categoryModel'); // adjust path

const handleCreateCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    const categoryImageUrl = req.file?.location; 

    if (!categoryName) {
      return res.status(400).json({ message: 'Category Name is required' });
    }

    const existingCategory = await Category.findOne({ where: { categoryName } });
    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({
      categoryName,
      categoryDescription,
      categoryImageUrl,
    });

    return res.status(201).json({ message: 'Category created successfully', newCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

const handleGetAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const handleGetCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};


const handleUpdateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, categoryDescription } = req.body;
    const categoryImageUrl = req.file?.location;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.categoryName = categoryName || category.categoryName;
    category.categoryDescription = categoryDescription || category.categoryDescription;
    if (categoryImageUrl) category.categoryImageUrl = categoryImageUrl;

    await category.save();

    return res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

const handleDeleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

module.exports = {
  handleCreateCategory ,
  handleGetAllCategories,
  handleGetCategoryById,
  handleUpdateCategory,
  handleDeleteCategory,
};
