const { Op } = require("sequelize");
const Category = require("../../models/categoryModel/categoryModel");

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

const handleUpdateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { categoryName, categoryDescription, parentCategoryId } = req.body;
       const categoryImage = req.file || null;
    const categoryImageUrl = categoryImage?.location || null;

    const category = await Category.findByPk(categoryId);
    console.log("Requested category ID:", categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.categoryName = categoryName || category.categoryName;
    category.categoryDescription =
      categoryDescription || category.categoryDescription;
   category.categoryImage = categoryImageUrl || category.categoryImage;

    category.parentCategoryId = parentCategoryId || null;

    await category.save();

    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
      console.error("Update Category Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const handleDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.destroy({ where: { parentCategoryId: categoryId } });

    await category.destroy();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const handleDeleteAllSubcategories = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.destroy({ where: { parentCategoryId: categoryId } });

    return res
      .status(200)
      .json({ message: "Subcategories deleted successfully" });
  } catch (error) {
    console.error("Delete Subcategories Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const handleDeleteSelectedSubcategories = async (req, res) => {
  try {
    const { subcategoryIds } = req.body;

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
      return res.status(400).json({ message: "No subcategory IDs provided" });
    }

    // Delete only subcategories with the provided IDs
    //example { "subcategoryIds": [4, 5, 6] }
            
                    

    await Category.destroy({
      where: {
        id: subcategoryIds,
         parentCategoryId: { [Op.not]: null },
      },
    });

    return res
      .status(200)
      .json({ message: "Selected subcategories deleted successfully" });
  } catch (error) {
    console.error("Delete Selected Subcategories Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};



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
  getSingleCategoryWithSubcategories,
   handleDeleteAllSubcategories,
   handleDeleteSelectedSubcategories
};
