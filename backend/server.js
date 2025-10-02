// backend/server.js
const app = require('./src/app');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database configuration to test connection
require('./src/config/database');

// Import model associations
require('./src/models/index');

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
});