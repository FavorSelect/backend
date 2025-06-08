const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const Seller = require("../authModel/sellerModel");

const SellerTicket = sequelize.define(
  "SellerTicket",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Seller, key: "id" },
      onDelete: "CASCADE",
    },
    ticketNumber: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
    },
    subject: { type: DataTypes.STRING, 
      allowNull: false },
    description: { type: DataTypes.TEXT,
       allowNull: false 
      },
    imageUrl: { type: DataTypes.STRING 
      
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "closed","resolved"),
      defaultValue: "open",
    },
    adminReply: { type: DataTypes.TEXT },
  },
  {
    tableName: "seller_tickets",
    timestamps: true,
  }
);

module.exports = SellerTicket;
