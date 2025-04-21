const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const { createTokenForUser } = require('../authService/authService');

// Controller for user signup
const handleSignUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const result = createUser({ firstName, lastName, email, password: hashedPassword });

    return res.status(201).json({ success: true, message: "User created successfully", user: {firstName, lastName, email } });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Controller for user login
const handleSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const user = getUserByEmail(email);

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If credentials are valid, generate JWT token (use your JWT logic here)
    const token =createTokenForUser(user)

    return res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = {
  handleSignUp,
  handleSignin,
};
