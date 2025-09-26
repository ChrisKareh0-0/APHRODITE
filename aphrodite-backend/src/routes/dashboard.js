const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics
} = require('../controllers/dashboardController');

// All dashboard routes require authentication
router.use(auth);

// Dashboard overview statistics
router.get('/stats', getDashboardStats);

// Sales analytics with date range
router.get('/sales-analytics', getSalesAnalytics);

// Product analytics
router.get('/product-analytics', getProductAnalytics);

// Customer analytics
router.get('/customer-analytics', getCustomerAnalytics);

module.exports = router;
