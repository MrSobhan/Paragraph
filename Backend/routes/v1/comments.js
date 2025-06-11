const express = require('express');
const { createComment, updateComment, deleteComment, approveComment } = require('../../controllers/v1/comments');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const adminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', authenticatedMiddleware, createComment);
router.put('/:id', authenticatedMiddleware, updateComment);
router.delete('/:id', authenticatedMiddleware, deleteComment);
router.patch('/:id/approve', authenticatedMiddleware, adminMiddleware, approveComment);

module.exports = router;