const  Product  = require("../../models/productModel/productModel");
const elasticClient= require('../../config/elasticSearchConfig/elasticSearchClient');
const Category = require('../../models/categoryModel/categoryModel');
const Seller = require('../../models/authModel/sellerModel');
const { Op } = require("sequelize");

const handleAddProduct = async (req, res) => {
 
  try {
    const sellerId = req.user.id; 
    const {
      productName,
      productDescription,
      productBrand,
      productCategoryId,
      stockKeepingUnit,
      productModelNumber,
      productBestSaleTag,

      productDiscountPercentage,
      productPrice,
      productDiscountPrice,
      saleDayleft,

      availableStockQuantity,
      productWeight,

      galleryImageUrls,
      productVideoUrl,

      productWarrantyInfo,
      productReturnPolicy,
    } = req.body;
    if (!req.file || !req.file.location) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed or missing.",
      });
    }
    if (
      !productName ||
      !productDescription ||
      !productBrand ||
      !productCategoryId ||
      !productPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const product = await Product.create({
      productName,
      productDescription,
      productBrand,
      productCategoryId,
      stockKeepingUnit: stockKeepingUnit || null,
      productModelNumber: productModelNumber || null,
      productBestSaleTag: productBestSaleTag || null,

      productDiscountPercentage: productDiscountPercentage || null,
      productPrice,
      productDiscountPrice: productDiscountPrice || null,
      saleDayleft: saleDayleft || null,

      availableStockQuantity: availableStockQuantity || 0,
      productWeight: productWeight || null,
      status: 'pending',

      coverImageUrl: req.file.location,
      galleryImageUrls: galleryImageUrls || null,
      productVideoUrl: productVideoUrl || null,

      productWarrantyInfo: productWarrantyInfo || null,
      productReturnPolicy: productReturnPolicy || null,
      sellerId  // 🔗 link seller and product
    });

    await elasticClient.index({
      index: 'products',
      id: product.id.toString(),
      document: {
        ...product.toJSON()
      }
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product.",
      error: error.message,
    });
  }
};

const handleUpdateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    const {
      productName,
      productDescription,
      productBrand,
      productCategory,
      stockKeepingUnit,
      productModelNumber,
      productBestSaleTag,
      productDiscountPercentage,
      productPrice,
      productDiscountPrice,
      saleDayleft,
      availableStockQuantity,
      productWeight,
      galleryImageUrls,
      productVideoUrl,
      productWarrantyInfo,
      productReturnPolicy,
    } = req.body;

    const updateFields = {
      productName,
      productDescription,
      productBrand,
      productCategory,
      stockKeepingUnit: stockKeepingUnit || null,
      productModelNumber: productModelNumber || null,
      productBestSaleTag: productBestSaleTag || null,
      productDiscountPercentage: productDiscountPercentage || null,
      productPrice,
      productDiscountPrice: productDiscountPrice || null,
      saleDayleft: saleDayleft || null,
      availableStockQuantity: availableStockQuantity || 0,
      productWeight: productWeight || null,
      galleryImageUrls: galleryImageUrls || null,
      productVideoUrl: productVideoUrl || null,
      productWarrantyInfo: productWarrantyInfo || null,
      productReturnPolicy: productReturnPolicy || null,
    };

    // Check if image uploaded
    if (req.file && req.file.location) {
      updateFields.coverImageUrl = req.file.location;
    }

    await product.update(updateFields);

    await elasticClient.update({
      index: 'products',
      id: product.id.toString(),
      doc: product.toJSON()
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product.",
      error: error.message,
    });
  }
};

const handleDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await product.destroy();

    await elasticClient.delete({
      index: 'products',
      id: product.id.toString()
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product.",
      error: error.message,
    });
  }
};
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.findAll({ where: { status: 'approved' } });
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.error("Get All Products Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching all products",
//       error: error.message,
//     });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const product = await Product.findByPk(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error("Get Product by ID Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching product by ID",
//       error: error.message,
//     });
//   }
// };

// const searchProducts = async (req, res) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing search query",
//     });
//   }

//   try {
//     const { hits } = await elasticClient.search({
//       index: 'products',
//       query: {
//         multi_match: {
//           query,
//           fields: ['productName', 'productBrand', 'productCategory'],
//           fuzziness: 'AUTO' // improves flexible matching
//         }
//       }
//     });

//     const results = hits.hits.map(hit => hit._source);

//     res.status(200).json({
//       success: true,
//       products: results,
//     });
//   } catch (error) {
//     console.error("Elasticsearch Search Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while searching products",
//       error: error.message,
//     });
//   }
// };

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: 'approved' },
      include: [
        {
          model: Category,
          attributes: ['categoryName'], 
        },
         {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
      ],
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all products",
      error: error.message,
    });
  }
};


// const getAllProducts = async (req, res) => {
//   try {
//     const {
//       minPrice,
//       maxPrice,
//       page = 1,
//       limit = 10,
//       sort = "createdAt_desc",
//     } = req.query;

//     // Build the price filter conditionally
//     const priceFilter = {};
//     if (minPrice) priceFilter[Op.gte] = parseFloat(minPrice);
//     if (maxPrice) priceFilter[Op.lte] = parseFloat(maxPrice);

//     // Build the where clause
//     const whereClause = {
//       status: "approved",
//     };
//     if (Object.keys(priceFilter).length) {
//       whereClause.price = priceFilter;  // Assuming your Product model has a 'price' field
//     }

//     // Pagination
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const parsedLimit = parseInt(limit);

//     // Sorting
//     let order = [];
//     switch (sort) {
//       case "price_asc":
//         order = [["price", "ASC"]];
//         break;
//       case "price_desc":
//         order = [["price", "DESC"]];
//         break;
//       case "createdAt_asc":
//         order = [["createdAt", "ASC"]];
//         break;
//       case "createdAt_desc":
//       default:
//         order = [["createdAt", "DESC"]];
//         break;
//     }

//     const { count, rows: products } = await Product.findAndCountAll({
//       where: whereClause,
//       include: [
//         {
//           model: Category,
//           attributes: ["categoryName"],
//         },
//       ],
//       order,
//       offset,
//       limit: parsedLimit,
//     });

//     res.status(200).json({
//       success: true,
//       totalItems: count,
//       totalPages: Math.ceil(count / parsedLimit),
//       currentPage: parseInt(page),
//       products,
//     });
//   } catch (error) {
//     console.error("Get All Products Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching all products",
//       error: error.message,
//     });
//   }
// };


const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ['categoryName'],
        },
         {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product by ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product by ID",
      error: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Missing search query",
    });
  }

  try {
    const { hits } = await elasticClient.search({
      index: 'products',
      query: {
        multi_match: {
          query,
          fields: ['productName', 'productBrand'],
          fuzziness: 'AUTO',
        },
      },
    });

    const productIds = hits.hits.map(hit => hit._source.id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    // Fetch only matched products from DB with associations
    const products = await Product.findAll({
      where: {
        id: productIds,
        status: 'approved',
      },
      include: [
        {
          model: Category,
          attributes: ['categoryName'],
        },
        {
          model: Seller,
          as: 'seller',
          attributes: ['id', 'sellerName', 'email', 'shopName'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Elasticsearch Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching products",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.findAll({
      where: { status: "approved" },
      include: [
        {
          model: Category,
          where: { categoryName },
          attributes: ["categoryName"],
        },
         {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
      ],
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Products by Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products by category",
      error: error.message,
    });
  }
};


const getProductsByBrand = async (req, res) => {
  const { brandName } = req.params;

  try {
    const products = await Product.findAll({
      where: {
        status: "approved",
        productBrand: { [Op.like]: `%${brandName}%` },
      },
      include: [
        {
          model: Category,
          attributes: ["categoryName"],
        },
         {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
      ],
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Products by Brand Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products by brand",
      error: error.message,
    });
  }
};

const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: "approved" },
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [
        {
          model: Category,
          attributes: ["categoryName"],
        },
         {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
      ],
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Recent Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recent products",
      error: error.message,
    });
  }
};


module.exports = {
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getRecentProducts
};
