const express = require('express');
const { getNotifications, markAsRead } = require('../../controllers/v1/notifications');
const authenticatedMiddleware = require('../../middlewares/authenticated');

const router = express.Router();

router.get('/', authenticatedMiddleware, getNotifications);
router.put('/:id/read', authenticatedMiddleware, markAsRead);

module.exports = router;