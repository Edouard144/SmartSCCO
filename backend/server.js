require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generalLimiter } = require('./utils/rateLimiter');


const walletRoutes = require('./routes/walletRoutes');
const loanRoutes = require('./routes/loanRoutes');
const pinRoutes = require('./routes/pinRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();


app.use(cors());          // Allow frontend/mobile to connect
app.use(express.json());  // Parse incoming JSON requests
app.use(generalLimiter);


// All auth routes start with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/pin', pinRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));