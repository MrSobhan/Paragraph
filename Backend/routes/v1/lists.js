const express = require('express');
const { createList, updateList, deleteList, addPostToList, removePostFromList } = require('../../controllers/v1/lists');
const authenticatedMiddleware = require('../../middlewares/authenticated');

const router = express.Router();

router.post('/', authenticatedMiddleware, createList);
router.put('/:id', authenticatedMiddleware, updateList);
router.delete('/:id', authenticatedMiddleware, deleteList);
router.post('/:id/posts', authenticatedMiddleware, addPostToList);
router.delete('/:id/posts/:postId', authenticatedMiddleware, removePostFromList);

module.exports = router;