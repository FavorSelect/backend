const Category = require("../../models/categoryModel/categoryModel");

//  Add Category (main or subcategory)
const handleAddCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription, parentCategoryId } = req.body;
    const categoryImage = req.file;
    if (!categoryImage) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an cover image" });
    }
    const categoryImageUrl = categoryImage.location;
    const existing = await Category.findOne({ where: { categoryName } });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }
  const parsedParentId =
      !parentCategoryId || parentCategoryId === "null" || parentCategoryId === ""
        ? null
        : parseInt(parentCategoryId, 10);
    const category = await Category.create({
      categoryName,
      categoryDescription,
      categoryImage: categoryImageUrl,
      parentCategoryId: parsedParentId,
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//  Update Category
const handleUpdateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, categoryDescription, parentCategoryId } = req.body;
    const categoryImage = req.file;
    if (!categoryImage) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an cover image" });
    }
    const categoryImageUrl = categoryImage.location;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.categoryName = categoryName || category.categoryName;
    category.categoryDescription =
      categoryDescription || category.categoryDescription;
    category.categoryImage = categoryImageUrl || category.categoryImageUrl;
    category.parentCategoryId = parentCategoryId || null;

    await category.save();

    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//  Delete Category (and optionally its subcategories)
const handleDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optionally delete all subcategories
    await Category.destroy({ where: { parentCategoryId: categoryId } });

    await category.destroy();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//  Get All Categories (with subcategories)
const handleGetAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentCategoryId: null },
      include: [
        {
          model: Category,
          as: "subcategories",
        },
      ],
    });

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
// GET /api/categories/:id/with-subcategories

const getSingleCategoryWithSubcategories = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: {
        model: Category,
        as: 'subcategories',
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  handleGetAllCategories,
  handleDeleteCategory,
  handleUpdateCategory,
  handleAddCategory,
  getSingleCategoryWithSubcategories
};
