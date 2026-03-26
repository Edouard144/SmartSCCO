require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

const ADMIN_EMAIL = 'admin@smartscco.com';
const ADMIN_PASSWORD = 'admin123'; // Change this password after first login
const ADMIN_NAME = 'System Administrator';
const ADMIN_NATIONAL_ID = 'ADMIN001';
const ADMIN_PHONE = '+2500000000000';

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists!');
      console.log('Email:', ADMIN_EMAIL);
      // Update the role to superadmin
      await pool.query(
        'UPDATE users SET role = $1 WHERE email = $2',
        ['superadmin', ADMIN_EMAIL]
      );
      console.log('Admin role updated to superadmin');
      return;
    }

    // Hash the password
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create the admin user
    const result = await pool.query(
      `INSERT INTO users (full_name, national_id, phone, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role`,
      [ADMIN_NAME, ADMIN_NATIONAL_ID, ADMIN_PHONE, ADMIN_EMAIL, password_hash, 'superadmin']
    );

    // Create a wallet for the admin
    await pool.query(
      `INSERT INTO wallets (user_id) VALUES ($1)`,
      [result.rows[0].id]
    );

    console.log('Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Role: superadmin');
    console.log('');
    console.log('IMPORTANT: Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();
