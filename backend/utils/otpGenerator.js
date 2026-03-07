// Stores OTPs temporarily in memory { email: { otp, expiresAt } }
const otpStore = {};

// Generate a random 6-digit OTP and save it
const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP expires in 5 minutes
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expiresAt };

  // Simulate SMS — in production this sends a real SMS
  console.log(`📱 OTP for ${email}: ${otp}`);

  return otp;
};

// Verify OTP entered by user
const verifyOTP = (email, enteredOtp) => {
  const record = otpStore[email];

  if (!record) return false;                    
  if (Date.now() > record.expiresAt) return false; 
  if (record.otp !== enteredOtp) return false;  

  // OTP is valid — delete it so it can't be reused
  delete otpStore[email];
  return true;
};

module.exports = { generateOTP, verifyOTP };