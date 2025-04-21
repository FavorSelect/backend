const db = require('../config/dbConnection');
// Function to create the "users" table if it does not exist
const createTableIfNotExists = (callback) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;
  db.query(createTableQuery, callback);
};

// Function to create a new user
const createUser = (userData, callback) => {
  const { firstName, lastName, email, password } = userData;

  // First, ensure the table exists
  createTableIfNotExists((err) => {
    if (err) {
      return callback(err, null);
    }

    // Insert user into the table
    const query = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
    db.query(query, [firstName, lastName, email, password], callback);
  });
};

// Function to get a user by email
const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';

  // Ensure the table exists
  createTableIfNotExists((err) => {
    if (err) {
      return callback(err, null);
    }

    // Fetch user by email
    db.query(query, [email], callback);
  });
};

// Function to get a user by ID
const getUserById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';

  // Ensure the table exists
  createTableIfNotExists((err) => {
    if (err) {
      return callback(err, null);
    }
    // Fetch user by ID
    db.query(query, [id], callback);
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
