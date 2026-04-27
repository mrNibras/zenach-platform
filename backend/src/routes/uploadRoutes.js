const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadImage } = require('../controllers/uploadController');

// Endpoint for image uploads (protected: only admins can upload)
router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;