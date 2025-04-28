const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const Category = require('../categoryModel/categoryModel');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  productBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  productCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category, // Reference to the Category model
      key: 'id'
    }
  },

  stockKeepingUnit: {
    type: DataTypes.STRING,
  },

  productModelNumber: {
    type: DataTypes.STRING,
  },

  productBestSaleTag: {
    type: DataTypes.STRING,
  },

  // Pricing
  productDiscountPercentage: {
    type: DataTypes.FLOAT,
  },

  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  productDiscountPrice: {
    type: DataTypes.FLOAT,
  },

  saleDayleft: {
    type: DataTypes.STRING,
  },

  saleStartDate: {
    type: DataTypes.DATE,
  },

  saleEndDate: {
    type: DataTypes.DATE,
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

  // Media
  coverImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
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

  customerReviews: {
    type: DataTypes.STRING,
  },

  // Tags & Metadata
  productTags: {
    type: DataTypes.STRING,
  },

  productWarrantyInfo: {
    type: DataTypes.STRING,
  },

  productReturnPolicy: {
    type: DataTypes.TEXT,
  },

  isNewArrivalProduct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },

}, {
  tableName: 'products',
  timestamps: true,
});



module.exports = Product ;
