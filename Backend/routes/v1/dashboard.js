const express = require('express');
const { getDashboardStats } = require('../../controllers/v1/dashboard');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const adminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router.get('/stats', authenticatedMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;