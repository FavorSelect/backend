const Product = require("../../models/productModel/productModel");
const elasticClient = require("../../config/elasticSearchConfig/elasticSearchClient");
const Category = require("../../models/categoryModel/categoryModel");
const Seller = require("../../models/authModel/sellerModel");
const { Op, fn, col, literal } = require("sequelize");
const {
  extractLabelsFromImageS3,
} = require("../../awsRekognition/awsRekognition");
const Review = require("../../models/reviewModel/reviewModel");
const User = require("../../models/authModel/userModel");
const ReviewLike = require("../../models/reviewLikeModel/reviewLikeModel");

const handleAddProduct = async (req, res) => {
  try {
    let sellerId = null;

    if (req.user.role === "seller") {
      const seller = await Seller.findOne({ where: { userId: req.user.id } });
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found for the logged-in user.",
        });
      }
      sellerId = seller.id;
    }

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
      productSizes,
      productColors,
      productDimensions,
      productMaterial,

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

    const imageKey = decodeURIComponent(
      new URL(req.file.location).pathname.slice(1)
    );
    const rekognitionLabels = await extractLabelsFromImageS3(
      process.env.AWS_BUCKET_NAME,
      imageKey
    );

    const productTags = rekognitionLabels.join(", ");

    const category = await Category.findByPk(productCategoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.increment("categoryProductCount");

    const product = await Product.create({
      productName,
      productDescription,
      productBrand,
      productCategoryId,
      stockKeepingUnit: stockKeepingUnit || null,
      productModelNumber: productModelNumber || null,
      productBestSaleTag: productBestSaleTag || null,

      productMaterial: productMaterial || null,
      productDimensions: productDimensions || null,
      productColors: productColors || null,
      productSizes: productSizes || null,

      productDiscountPercentage: productDiscountPercentage || null,
      productPrice,
      productDiscountPrice: productDiscountPrice || null,
      saleDayleft: saleDayleft || null,

      availableStockQuantity: availableStockQuantity || 0,
      productWeight: productWeight || null,
      status: req.user.role === "admin" ? "approved" : "pending",

      coverImageUrl: req.file.location,
      galleryImageUrls: galleryImageUrls || null,
      productVideoUrl: productVideoUrl || null,

      productWarrantyInfo: productWarrantyInfo || null,
      productReturnPolicy: productReturnPolicy || null,
      sellerId,
      UserId: req.user.id,
      productTags,
      rekognitionLabels,
    });

    await elasticClient.index({
      index: "products",
      id: product.id.toString(),
      body: {
        ...product.toJSON(),
        suggest: {
          input: [
            product.productName,
            product.productBrand,
            ...(product.productTags ? product.productTags.split(",") : []),
          ],
        },
      },
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

    const updateFields = {};

    const fields = [
      "productName",
      "productDescription",
      "productBrand",
      "productCategoryId",
      "stockKeepingUnit",
      "productModelNumber",
      "productBestSaleTag",
      "productDiscountPercentage",
      "productPrice",
      "productDiscountPrice",
      "saleDayleft",
      "availableStockQuantity",
      "productWeight",
      "productSizes",
      "productColors",
      "productDimensions",
      "productMaterial",
      "productWarrantyInfo",
      "productReturnPolicy",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (req.file && req.file.location) {
      updateFields.coverImageUrl = req.file.location;

      const imageKey = decodeURIComponent(
        new URL(req.file.location).pathname.slice(1)
      );
      const rekognitionLabels = await extractLabelsFromImageS3(
        process.env.AWS_BUCKET_NAME,
        imageKey
      );

      updateFields.rekognitionLabels = rekognitionLabels;
      updateFields.productTags = rekognitionLabels.join(", ");
    }

    const galleryImages = req.files?.galleryImageUrls || [];
    if (galleryImages.length > 0) {
      updateFields.galleryImageUrls = galleryImages.map((img) => img.location);
    }

    const productVideo = req.files?.productVideoUrl?.[0];
    if (productVideo?.location) {
      updateFields.productVideoUrl = productVideo.location;
    }

    await product.update(updateFields);

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
      index: "products",
      id: product.id.toString(),
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
    const {
      categories,
      brands,
      minPrice,
      maxPrice,
      inventoryStatus,
      colors,
      sortBy,
    } = req.query;

    const categoryFilter = categories
      ? categories.split(",").map((c) => c.trim())
      : null;
    const brandFilter = brands ? brands.split(",").map((b) => b.trim()) : null;
    const inventoryFilter = inventoryStatus
      ? inventoryStatus.split(",").map((s) => s.trim())
      : null;
    const colorFilter = colors ? colors.split(",").map((c) => c.trim()) : null;

    let orderClause = [["createdAt", "DESC"]];
    switch (sortBy) {
      case "popular":
        orderClause = [["totalSoldCount", "DESC"]];
        break;
      case "rating":
        orderClause = [["averageCustomerRating", "DESC"]];
        break;
      case "priceLowToHigh":
        orderClause = [["productPrice", "ASC"]];
        break;
      case "priceHighToLow":
        orderClause = [["productPrice", "DESC"]];
        break;
      case "latest":
        orderClause = [["createdAt", "DESC"]];
        break;
    }

    const whereClause = {
      status: "approved",
      ...(brandFilter && {
        productBrand: { [Op.in]: brandFilter },
      }),
      ...((minPrice || maxPrice) && {
        productPrice: {
          ...(minPrice && { [Op.gte]: parseFloat(minPrice) }),
          ...(maxPrice && { [Op.lte]: parseFloat(maxPrice) }),
        },
      }),

      ...(inventoryFilter && {
        inventoryStatus: { [Op.in]: inventoryFilter },
      }),
      ...(colorFilter && {
        productColors: {
          [Op.or]: colorFilter.map((color) => ({
            [Op.like]: `%${color}%`,
          })),
        },
      }),
    };

    const includeClause = [
      {
        model: Category,
        as: "category",
        attributes: ["categoryName"],
        ...(categoryFilter && {
          where: {
            categoryName: { [Op.in]: categoryFilter },
          },
          required: true,
        }),
      },
      {
        model: Seller,
        as: "seller",
        attributes: ["id", "sellerName", "email", "shopName"],
        required: false,
      },
    ];

    const products = await Product.findAll({
      where: whereClause,
      include: includeClause,
      order: orderClause,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
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
          as: "category",
          attributes: ["id", "categoryName", "parentCategoryId"],
          include: [
            {
              model: Category,
              as: "parentCategory",
              attributes: ["id", "categoryName"],
            },
          ],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
        },
        {
          model: Review,
          as: "reviews",
          attributes: [
            "id",
            "userId",
            "productId",
            "rating",
            "reviewText",
            "reviewPhoto",
            "reviewLike",
            "reviewDate",
            "createdAt",
            "updatedAt",
            // [
            //   // Subquery to count review likes per review
            //   literal(`(
            //     SELECT COUNT(*) 
            //     FROM reviewlikes AS rl 
            //     WHERE rl.reviewId = reviews.id
            //   )`),
            //   "likeCount",
            // ],
          ],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
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

  if (!query || query.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: "Missing or too short search query",
    });
  }

  try {
    const esResult = await elasticClient.search({
      index: "products",
      body: {
        size: 20,
        query: {
          multi_match: {
            query,
            fields: ["productName^3", "productBrand^2", "productTags"],
            type: "phrase_prefix",
          },
        },
      },
    });

    const productIds = esResult.body.hits.hits.map((hit) => hit._source.id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    const products = await Product.findAll({
      where: {
        id: productIds,
        status: "approved",
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["categoryName"],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
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
          as: "category",
          where: { categoryName },
          attributes: ["categoryName"],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
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
          as: "category",
          attributes: ["categoryName"],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
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

const getProductsByCategoryMultiple = async (req, res) => {
  const { categories } = req.query;
  const { categoryName } = req.params;

  const categoryArray = categories
    ? categories.split(",").map((c) => c.trim())
    : categoryName
    ? [categoryName]
    : [];

  console.log("Filtering categories:", categoryArray);

  try {
    const products = await Product.findAll({
      where: { status: "approved" },
      include: [
        {
          model: Category,
          as: "category",
          where:
            categoryArray.length > 0
              ? { categoryName: { [Op.in]: categoryArray } }
              : undefined,
          attributes: ["categoryName"],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
        },
      ],
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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

const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: "approved" },
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["categoryName"],
        },
        {
          model: Seller,
          as: "seller",
          attributes: ["id", "sellerName", "email", "shopName"],
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

const handleGetQuerySuggestions = async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 2) {
    return res.status(200).json({ success: true, suggestions: [] });
  }

  try {
    const result = await elasticClient.search({
      index: "products",
      body: {
        size: 10,
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  productName: query,
                },
              },
              {
                match_phrase_prefix: {
                  productBrand: query,
                },
              },
              {
                match_phrase_prefix: {
                  productTags: query,
                },
              },
            ],
          },
        },
        _source: ["productName", "productBrand", "productTags"],
      },
    });

    const suggestionsSet = new Set();

    result.body.hits.hits.forEach((hit) => {
      const { productName, productBrand, productTags } = hit._source;

      if (productName) suggestionsSet.add(productName);
      if (productBrand) suggestionsSet.add(productBrand);
      if (productTags) {
        const tags = productTags.split(",");
        tags.forEach((tag) => suggestionsSet.add(tag.trim()));
      }
    });

    const suggestions = Array.from(suggestionsSet).slice(0, 8);

    res.status(200).json({ success: true, suggestions });
  } catch (err) {
    console.error("OpenSearch suggestion error:", err);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: err.message,
    });
  }
};

const getSimilarProducts = async (req, res) => {
  const { productId } = req.params;

  try {
    const currentProduct = await Product.findByPk(productId);

    if (!currentProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { productTags, productBrand, productCategoryId } = currentProduct;

    const tagList = productTags
      ? productTags.split(",").map((tag) => tag.trim().toLowerCase())
      : [];

    const similarProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: productId },
        status: "approved",
        [Op.or]: [
          {
            productTags: {
              [Op.or]: tagList.map((tag) => ({
                [Op.like]: `%${tag}%`,
              })),
            },
          },
          {
            productBrand: productBrand
              ? { [Op.like]: `%${productBrand}%` }
              : undefined,
          },
          {
            productCategoryId,
          },
        ],
      },
      limit: 20,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "productName",
        "productTags",
        "productBrand",
        "productPrice",
        "coverImageUrl",
        "averageCustomerRating",
        "totalCustomerReviews",
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["categoryName"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      similarProducts,
    });
  } catch (error) {
    console.error("Get Similar Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching similar products",
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
  getRecentProducts,
  getProductsByCategoryMultiple,
  handleGetQuerySuggestions,
  getSimilarProducts,
};
