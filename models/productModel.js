const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');

const Product = sequelize.define('Product', {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productSlug: {
    type: DataTypes.STRING,
    unique: true,
  },
  productDescription: {
    type: DataTypes.TEXT,
  },
  productShortDescription: {
    type: DataTypes.STRING,
  },
  productBrand: {
    type: DataTypes.STRING,
  },
  productCategory: {
    type: DataTypes.STRING,
  },
  productSubCategory: {
    type: DataTypes.STRING,
  },
  stockKeepingUnit: {
    type: DataTypes.STRING,
    unique: true,
  },
  productBarcode: {
    type: DataTypes.STRING,
  },
  productModelNumber: {
    type: DataTypes.STRING,
  },

  // Pricing
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productDiscountPrice: {
    type: DataTypes.FLOAT,
  },
  priceCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  isOnSale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  saleStartDate: {
    type: DataTypes.DATE,
  },
  saleEndDate: {
    type: DataTypes.DATE,
  },
  applicableTaxRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },

  // Inventory
  availableStockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  inventoryStatus: {
    type: DataTypes.ENUM('InStock', 'OutOfStock', 'BackOrder'),
    defaultValue: 'InStock',
  },
  productWeight: {
    type: DataTypes.FLOAT,
  },
  productDimensions: {
    type: DataTypes.JSON, // { height, width, depth }
  },
  shippingClassName: {
    type: DataTypes.STRING,
  },

  // Media
  mainImageUrl: {
    type: DataTypes.STRING,
  },
  galleryImageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  productVideoUrl: {
    type: DataTypes.STRING,
  },

  // Ratings & Reviews
  averageCustomerRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalCustomerReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  // Tags & Metadata
  productTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  productFeatures: {
    type: DataTypes.JSON,
  },
  productWarrantyInfo: {
    type: DataTypes.STRING,
  },
  productReturnPolicy: {
    type: DataTypes.TEXT,
  },
  isFeaturedProduct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isNewArrivalProduct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  productVisibilityStatus: {
    type: DataTypes.ENUM('Public', 'Private', 'Archived'),
    defaultValue: 'Public',
  },

  // Analytics
  productViewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalSoldCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  associatedVendorId: {
    type: DataTypes.INTEGER,
  },

  internalAdminNotes: {
    type: DataTypes.TEXT,
  },

}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = { Product };
