const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:eventId/download', protect, authorize('student'), generateCertificate);

module.exports = router;
