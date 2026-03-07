const pool = require('../db');

// Save a new user into the database
const createUser = async ({ full_name, national_id, phone, email, password_hash, role }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, national_id, phone, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [full_name, national_id, phone, email, password_hash, role]
  );
  return result.rows[0]; // Return the created user
};

// Find a user by their email (used during login)
const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0]; // Returns user or undefined
};

// Find a user by their ID (used to get profile)
const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, full_name, phone, email, role, kyc_status FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Save a hashed PIN for the user
const savePin = async (user_id, pin_hash) => {
  const result = await pool.query(
    `UPDATE users SET pin_hash = $1 WHERE id = $2 RETURNING *`,
    [pin_hash, user_id]
  );
  return result.rows[0];
};

// Get user with their PIN hash
const getUserPin = async (user_id) => {
  const result = await pool.query(
    `SELECT pin_hash FROM users WHERE id = $1`,
    [user_id]
  );
  return result.rows[0];
};

const saveRefreshToken = async (user_id, token) => {
  await pool.query(
    `UPDATE users SET refresh_token = $1 WHERE id = $2`,
    [token, user_id]
  );
};


// Find user by refresh token
const getUserByRefreshToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE refresh_token = $1`,
    [token]
  );
  return result.rows[0];
};

module.exports = { createUser, getUserByEmail, getUserById, savePin, getUserPin, saveRefreshToken, getUserByRefreshToken };
