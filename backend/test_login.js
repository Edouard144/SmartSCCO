const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'edouardtuyubahe@gmail.com',
      password: 'new_password', 
      method: 'phone'
    });
    console.log(response.data);
  } catch (err) {
    if (err.response) {
      console.error("HTTP ERROR:", err.response.status, err.response.data);
    } else {
      console.error(err);
    }
  }
}

testLogin();
