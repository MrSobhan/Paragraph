const express = require('express');
const { createTopic, updateTopic, deleteTopic, getTopics } = require('../../controllers/v1/topics');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const isAdminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router.get('/', getTopics);
router.post('/', authenticatedMiddleware, isAdminMiddleware, createTopic);
router.put('/:id', authenticatedMiddleware, isAdminMiddleware, updateTopic);
router.delete('/:id', authenticatedMiddleware, isAdminMiddleware, deleteTopic);

module.exports = router;