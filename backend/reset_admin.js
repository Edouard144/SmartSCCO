require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

const ADMIN_EMAIL = 'admin@smartscco.com';
const NEW_PASSWORD = 'admin123';

async function resetAdminPassword() {
  try {
    // Hash the new password
    const password_hash = await bcrypt.hash(NEW_PASSWORD, 10);

    // Update the password
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, role',
      [password_hash, ADMIN_EMAIL]
    );

    if (result.rows.length === 0) {
      console.log('Admin user not found!');
      return;
    }

    console.log('Admin password reset successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('New Password:', NEW_PASSWORD);
    console.log('Role:', result.rows[0].role);

  } catch (error) {
    console.error('Error resetting admin password:', error.message);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
