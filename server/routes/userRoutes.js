const express = require('express');
const router = express.Router();
const {
    getUsers,
    getAnalytics,
    approveOrganizer,
    updateProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.put('/:id/approve', protect, authorize('admin'), approveOrganizer);

// Authenticated user routes
router.put('/profile', protect, updateProfile);

module.exports = router;
