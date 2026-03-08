const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart SACCO API',
      version: '1.0.0',
      description: 'Full backend API for Smart SACCO Digital Banking System'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // Scan all route files for swagger comments
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;