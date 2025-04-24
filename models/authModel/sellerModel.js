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
    allowNull: false,  
  },
  businessRegistrationNumber: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  taxIdentificationNumber: {
    type: DataTypes.STRING,
    allowNull:false,  
  },
  businessType: {
    type: DataTypes.ENUM('Retail', 'Wholesale', 'Manufacturer', 'Distributor'),
    allowNull: false,  
  },
  businessAddress: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  
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
  isAgreementSubmitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  shopDescription: {
    type: DataTypes.STRING,
    allowNull:false, 
  },
  shopLogo: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  // Location Details
  countryName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
    // Document Uploads
    identityProof: {
        type: DataTypes.STRING,
        allowNull:false, 
      },
      shopRegistrationDocument: {
        type: DataTypes.STRING,
        allowNull: false,  
      },
      verificationCode: {
        type: DataTypes.STRING,
      },
      verificationCodeExpiresAt: {
        type: DataTypes.DATE,
      },
      taxDocument: {
        type: DataTypes.STRING,
        allowNull:false,  
      },
  // Password for Seller login
  password: {
    type: DataTypes.STRING,
    allowNull: false,  
    validate: {
      len: [6, 100],  
    },
  },
}, {
  tableName: 'sellers',
  timestamps: true,
});


module.exports = Seller;
