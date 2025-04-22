const {sequelize} = require('../config/dbConnection');
const User = require('../models/authModel/userModel'); 
const { Product } = require('../models/productModel/productModel');

const initDB = (callback) => {
  sequelize.authenticate()
    .then(() => {
      console.log(' Database connected');
      return sequelize.sync(); // Creates tables if not exist
    })
    .then(() => {
      console.log(' All models synced');
      callback(); // Call the callback to start server
    })
    .catch((error) => {
      console.error(' Error connecting to the database:', error);
      process.exit(1); // Exit on failure
    });
};

module.exports = initDB;
