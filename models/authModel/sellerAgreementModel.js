const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const Seller = require('./sellerModel'); // Assuming Seller model exists

const SellerAgreement = sequelize.define('SellerAgreement', {
  agreementTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Ten individual agreement checkboxes (Yes/No)
  term1Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term2Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term3Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term4Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term5Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term6Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term7Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term8Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term9Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  term10Accepted: { type: DataTypes.BOOLEAN, defaultValue: false },



  isSigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  signedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Seller',
      key: 'id',
    }
  }
}, {
  tableName: 'seller_agreements',
  timestamps: true,
});


module.exports = SellerAgreement;
