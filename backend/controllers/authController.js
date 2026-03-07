const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, getUserById, saveRefreshToken, getUserByRefreshToken } = require('../models/userModel');
const { createWallet } = require('../models/walletModel');
const { generateOTP, verifyOTP } = require('../utils/otpGenerator');
const { saveDevice, findDevice, updateLastLogin } = require('../models/deviceModel');
const { validateRegister, validateLogin } = require('../utils/validators');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { full_name, national_id, phone, email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ full_name, national_id, phone, email, password_hash, role: 'member' });
    await createWallet(user.id);
    res.status(201).json({ message: 'Account created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN STEP 1 — verify password send OTP
const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    generateOTP(email);
    res.json({ message: 'OTP sent. Please verify to complete login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN STEP 2 — verify OTP issue tokens
const verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const valid = verifyOTP(email, otp);
    if (!valid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const user = await getUserByEmail(email);

    // Device tracking
    const ip_address = req.ip || req.connection.remoteAddress;
    const device_name = req.headers['user-agent'] || 'Unknown Device';
    const existingDevice = await findDevice(user.id, ip_address);

    if (!existingDevice) {
      await saveDevice(user.id, device_name, ip_address);
      await require('../db').query(
        `INSERT INTO fraud_alerts (user_id, alert_type, severity) VALUES ($1, 'new_device_login', 'medium')`,
        [user.id]
      );
    } else {
      await updateLastLogin(existingDevice.device_id);
    }

    // Generate both tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    await saveRefreshToken(user.id, refreshToken);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken, // Client saves this for later
      new_device: !existingDevice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// REFRESH TOKEN — get new access token using refresh token
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Check token exists in DB (not logged out)
    const user = await getUserByRefreshToken(token);
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    // Issue new access token
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

// LOGOUT — delete refresh token from DB
const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });

    // Remove refresh token so it can never be reused
    await require('../db').query(
      `UPDATE users SET refresh_token = NULL WHERE refresh_token = $1`,
      [token]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// FORGOT PASSWORD STEP 1 — send OTP to email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await getUserByEmail(email);
    // Always return same message to prevent email enumeration
    if (!user) return res.json({ message: 'If email exists, OTP has been sent' });

    generateOTP(email);
    res.json({ message: 'If email exists, OTP has been sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// FORGOT PASSWORD STEP 2 — verify OTP and set new password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;
    if (!email || !otp || !new_password) {
      return res.status(400).json({ error: 'Email, OTP and new password required' });
    }

    // Verify OTP
    const valid = verifyOTP(email, otp);
    if (!valid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Hash new password and save
    const password_hash = await bcrypt.hash(new_password, 10);
    await require('../db').query(
      `UPDATE users SET password_hash = $1 WHERE email = $2`,
      [password_hash, email]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, verifyLogin, refreshToken, logout, forgotPassword, resetPassword };