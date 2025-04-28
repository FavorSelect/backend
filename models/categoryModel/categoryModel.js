const { DataTypes } = require("sequelize");
const {sequelize }= require("../../mysqlConnection/dbConnection");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categoryDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "categories",
  timestamps: true
});

module.exports = Category;
