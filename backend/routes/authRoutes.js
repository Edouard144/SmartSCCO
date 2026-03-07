const express = require('express');
const router = express.Router();
const { register, login, verifyLogin, refreshToken, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { loginLimiter, otpLimiter } = require('../utils/rateLimiter');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/verify-otp', otpLimiter, verifyLogin);
router.post('/refresh-token', refreshToken);       // Get new access token
router.post('/logout', logout);                    // Logout
router.post('/forgot-password', forgotPassword);   // Request password reset
router.post('/reset-password', resetPassword);     // Set new password

module.exports = router;