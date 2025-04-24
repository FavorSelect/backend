const { DataTypes } = require('sequelize');
const { sequelize } = require('../../databaseConnection/dbConnection');
const User = require('./userModel'); 

const Seller = sequelize.define('Seller', {
  sellerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shopName: {
    type: DataTypes.STRING,
    allowNull: false,  // Shop name is mandatory
  },
  businessRegistrationNumber: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; can be used for official business registration
  },
  taxIdentificationNumber: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; used for tax purposes
  },
  businessType: {
    type: DataTypes.ENUM('Retail', 'Wholesale', 'Manufacturer', 'Distributor'),
    allowNull: false,  // Can be used to classify the business type
  },
  businessAddress: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional address for business
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; seller’s contact number
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; seller’s contact email
    validate: {
      isEmail: true,
    }
  },
  websiteURL: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  isPendingApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  shopDescription: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  shopLogo: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; shop logo URL or path
  },
  // Location Details
  countryName: {
    type: DataTypes.STRING,
    allowNull: false,  // Country is mandatory
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; state/province for the business location
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; city for the business location
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional; postal/zip code for the business location
  },
    // Document Uploads
    identityProof: {
        type: DataTypes.STRING,
        allowNull: true,  // URL or path for the identity proof document
      },
      shopRegistrationDocument: {
        type: DataTypes.STRING,
        allowNull: true,  // URL or path for the shop registration document
      },
      taxDocument: {
        type: DataTypes.STRING,
        allowNull: true,  // URL or path for the tax document
      },
  // Password for Seller login
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password is mandatory
    validate: {
      len: [6, 100],  // Password should be between 6 and 100 characters
    },
  },
  // Membership charge and type
  membershipCharge: {
    type: DataTypes.FLOAT,
    allowNull: true,  // Optional; membership charge for the seller
  },
  membershipType: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    allowNull: true,  // Optional; membership type (monthly or yearly)
  },
}, {
  tableName: 'sellers',
  timestamps: true,
});


module.exports = Seller;
