const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory store { email: { emailOTP, phoneOTP, expiresAt } }
const otpStore = {};

// Generate email OTP only
const generateEmailOTP = async (email) => {
  const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  if (!otpStore[email]) {
    otpStore[email] = { expiresAt };
  }
  otpStore[email].emailOTP = emailOTP;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Smart SACCO OTP Verification',
      text: `Your OTP is: ${emailOTP}. Valid for 5 minutes. Do not share it.`
    });
    console.log(`✅ Email OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email OTP');
  }

  return emailOTP;
};

// Generate phone OTP only
const generatePhoneOTP = async (email, phone) => {
  const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  if (!otpStore[email]) {
    otpStore[email] = { expiresAt };
  }
  otpStore[email].phoneOTP = phoneOTP;

  try {
    await twilioClient.messages.create({
      body: `Your Smart SACCO OTP is: ${phoneOTP}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`✅ SMS OTP sent to ${phone}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS OTP');
  }

  return phoneOTP;
};

// Verify OTP (email or phone)
const verifyOTP = (email, otp, method) => {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return false;
  }

  if (method === 'email') {
    return record.emailOTP === otp;
  } else if (method === 'phone') {
    return record.phoneOTP === otp;
  }
  return false;
};

module.exports = { generateEmailOTP, generatePhoneOTP, verifyOTP };