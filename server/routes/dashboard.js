const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');

router.get('/brand/:brandId', getDashboardData);

module.exports = router;

