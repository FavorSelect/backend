const mysql = require('mysql2'); // Ensure you're using mysql2 package
require('dotenv').config();

// Create a MySQL connection with promises
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Promisify the query function for async/await
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to connect to MySQL
const connectDB = () => {
  db.connect((err) => {
    if (err) {
      console.error('MySQL connection error:', err.stack);
      process.exit(1); // Exit on connection error
    }
    console.log('Connected to MySQL DB as ID', db.threadId);
  });
};

module.exports = { connectDB, query, db };  // Export query and db connection
