const { Product } = require('../models/productModel');

const handleAddProduct = async (req, res) => {
  try {
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
      saleStartDate,
      saleEndDate,

      availableStockQuantity,
      inventoryStatus,
      productWeight,

      coverImageUrl,
      galleryImageUrls,
      productVideoUrl,

    

      productTags,
      productWarrantyInfo,
      productReturnPolicy,
      isNewArrivalProduct,

     
    } = req.body;

    // Check required fields
    if (
      !productName || !productDescription || !productBrand || !productCategory ||
      !productPrice || !coverImageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const product = await Product.create({
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
      saleStartDate: saleStartDate || null,
      saleEndDate: saleEndDate || null,

      availableStockQuantity: availableStockQuantity || 0,
      inventoryStatus: inventoryStatus || 'InStock',
      productWeight: productWeight || null,

      coverImageUrl,
      galleryImageUrls: galleryImageUrls || null,
      productVideoUrl: productVideoUrl || null,


      productTags:  productTags || null,
      productWarrantyInfo: productWarrantyInfo || null,
      productReturnPolicy: productReturnPolicy || null,
      isNewArrivalProduct: isNewArrivalProduct || false,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product.",
      error: error.message
    });
  }
};

module.exports = { handleAddProduct };
