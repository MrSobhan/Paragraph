const express = require("express");

const { register, login, getMe } = require("../../controllers/v1/auth");
const { getUsers, getUserById, updateUser, deleteUser, followUser, unfollowUser, banUser, unbanUser , changeRole ,followTopic,unfollowTopic } = require('../../controllers/v1/users');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const adminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticatedMiddleware, getMe);


router.get('/', authenticatedMiddleware, adminMiddleware, getUsers);
router.get('/:id', authenticatedMiddleware, getUserById);
router.put('/:id', authenticatedMiddleware, updateUser);
router.delete('/:id', authenticatedMiddleware, adminMiddleware, deleteUser);
router.post('/:userId/follow', authenticatedMiddleware, followUser);
router.post('/:userId/unfollow', authenticatedMiddleware, unfollowUser);
router.put('/:id/ban', authenticatedMiddleware, adminMiddleware, banUser);
router.put('/:id/unban', authenticatedMiddleware, adminMiddleware, unbanUser);
router.put('/:id/change-role', authenticatedMiddleware, adminMiddleware, changeRole);

router.post('/:topicId/follow-topic', authenticatedMiddleware, followTopic);
router.post('/:topicId/unfollow-topic', authenticatedMiddleware, unfollowTopic);

module.exports = router;