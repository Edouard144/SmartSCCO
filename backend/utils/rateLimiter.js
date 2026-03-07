const rateLimit = require('express-rate-limit');

// Login limiter — max 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// OTP limiter — max 3 attempts per 10 minutes
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: { error: 'Too many OTP attempts. Try again after 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// General API limiter — max 100 requests per 10 minutes
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, otpLimiter, generalLimiter };