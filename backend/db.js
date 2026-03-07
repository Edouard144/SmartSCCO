// Loads environment variables from .env file
require('dotenv').config();

const { Pool } = require('pg');

// Creates a connection pool to Neon DB using the URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon DB
});

module.exports = pool;