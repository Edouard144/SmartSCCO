require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generalLimiter } = require('./utils/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const loanRoutes = require('./routes/loanRoutes');
const pinRoutes = require('./routes/pinRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const auditRoutes = require('./routes/auditRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reversalRoutes = require('./routes/reversalRoutes');  
const creditRoutes = require('./routes/creditRoutes');
const branchRoutes = require('./routes/branchRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/pin', pinRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reversals', reversalRoutes);
app.use('/api/credit', creditRoutes);    
app.use('/api/branches', branchRoutes);
app.use('/api/export', exportRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'SmartSCCO Banking API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      wallet: '/api/wallet',
      loans: '/api/loans',
      admin: '/api/admin',
      health: '/api/health'
    },
    documentation: 'https://smartscco-api.onrender.com/api-docs'
  });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

