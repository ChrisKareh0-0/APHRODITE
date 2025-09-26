const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getApiDocumentation,
  testApiEndpoint,
  getApiHealth
} = require('../controllers/apiTestController');

// API documentation (public)
router.get('/docs', getApiDocumentation);

// API health check (public)
router.get('/health', getApiHealth);

// Test API endpoint (requires authentication)
router.post('/test', auth, testApiEndpoint);

module.exports = router;
