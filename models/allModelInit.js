const {sequelize} = require('../config/dbConnection');
const User = require('../models/userModel'); 

const initDB = (callback) => {
  sequelize.authenticate()
    .then(() => {
      console.log(' Database connected');
      return sequelize.sync({ force: true }); // Creates tables if not exist
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
