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

  // Always overwrite with fresh OTP
  otpStore[email] = { emailOTP, expiresAt };

  console.log(`📦 OTP stored for ${email}:`, otpStore[email]);

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
    throw new Error('SMTP Error: ' + error.message);
  }

  return emailOTP;
};

// Generate phone OTP only
const generatePhoneOTP = async (email, phone) => {
  const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { phoneOTP, expiresAt };

  console.log(`📦 OTP stored for ${email}:`, otpStore[email]);

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
  console.log(`🔍 Verifying OTP for ${email}, method: ${method}, entered: ${otp}`);
  console.log(`📦 Store contents:`, JSON.stringify(otpStore[email]));

  const record = otpStore[email];
  if (!record) {
    console.log('❌ No record found');
    return false;
  }
  if (Date.now() > record.expiresAt) {
    console.log('❌ OTP expired');
    delete otpStore[email];
    return false;
  }

  if (method === 'email') {
    console.log(`🔑 Expected: ${record.emailOTP}, Got: ${otp}`);
    const valid = record.emailOTP === otp;
    if (valid) delete otpStore[email]; // delete after successful use
    return valid;
  } else if (method === 'phone') {
    console.log(`🔑 Expected: ${record.phoneOTP}, Got: ${otp}`);
    const valid = record.phoneOTP === otp;
    if (valid) delete otpStore[email];
    return valid;
  }
  return false;
};

module.exports = { generateEmailOTP, generatePhoneOTP, verifyOTP };