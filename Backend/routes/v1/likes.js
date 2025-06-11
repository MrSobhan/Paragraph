const express = require('express');
const { toggleLike } = require('../../controllers/v1/likes');
const authenticatedMiddleware = require('../../middlewares/authenticated');

const router = express.Router();

router.post('/', authenticatedMiddleware, toggleLike);

module.exports = router;