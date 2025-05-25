const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');

const Seller = sequelize.define('Seller', {
   id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
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
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  shopDescription: {
    type: DataTypes.STRING,
    allowNull:false, 
  },
 userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true, 
  references: {
    model: 'users', 
    key: 'id',
  }
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

  //membership 
  membershipId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "memberships",
      key: "id"
    }
  },
  status: {
  type: DataTypes.ENUM('active', 'suspended', 'deactive'),
  defaultValue: 'active',
},
  membershipStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  membershipEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
    // Document Uploads
    identityProof: {
        type: DataTypes.STRING,
        allowNull:true, 
      },
       shopLogo: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
      businessLicenseDocument: {
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
  hooks: {
    beforeValidate: (seller) => {
      // Trim all string fields
      for (let key in seller.dataValues) {
        if (typeof seller[key] === 'string') {
          seller[key] = seller[key].trim();
        }
      }
    }
  }
});


module.exports = Seller;
