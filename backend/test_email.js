require('dotenv').config();
const { generateEmailOTP } = require('./utils/otpGenerator');

async function testEmail() {
  try {
    const otp = await generateEmailOTP('edouardtuyubahe@gmail.com');
    console.log("Success! OTP is:", otp);
  } catch (err) {
    console.error("Test failed. Stack: ", err.stack);
  }
}

testEmail();
