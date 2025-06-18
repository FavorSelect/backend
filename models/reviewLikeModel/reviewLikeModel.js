const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User = require('../authModel/userModel');
const Review = require('../reviewModel/reviewModel');

const ReviewLike = sequelize.define('ReviewLike', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Review,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'reviewlikes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'reviewId'], 
    }
  ]
});

module.exports = ReviewLike;
