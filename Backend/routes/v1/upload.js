const express = require('express');
const { uploadFile } = require('../../controllers/v1/upload');
const authenticatedMiddleware = require('../../middlewares/authenticated');
const upload = require('../../utils/multerStorage');

const router = express.Router();

router.post('/', authenticatedMiddleware, upload.single('file'), uploadFile);

module.exports = router;