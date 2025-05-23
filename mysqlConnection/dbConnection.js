require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME_P,
  process.env.DB_USER_P,
  process.env.DB_PASS_P,
  {
    host: process.env.DB_HOST_P,
    dialect: 'mysql',
    logging: false,
  }
);

// Function to authenticate DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL DB via Sequelize');
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
