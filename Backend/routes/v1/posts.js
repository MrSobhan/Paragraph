const express = require('express');
const { getPosts, getPostById, createPost, updatePost, deletePost, publishPost , getPostsDashBoard} = require('../../controllers/v1/posts');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const adminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router.get('/', getPosts);
router.get('/dashboard', authenticatedMiddleware, getPostsDashBoard);
router.get('/:id', getPostById);
router.post('/', authenticatedMiddleware, createPost);
router.put('/:id', authenticatedMiddleware, updatePost);
router.delete('/:id', authenticatedMiddleware, deletePost);
router.put('/:id/publish', authenticatedMiddleware, adminMiddleware, publishPost);

module.exports = router;