const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    updateEventStatus,
    registerForEvent,
    markAttendance,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to get events (controller handles if they see all vs only approved based on auth context handled internally)
// We add an optional protect layer if needed, but we'll assume they need to be signed in to see events.
router.get('/', protect, getEvents);

// Organizer routes
router.post('/', protect, authorize('admin', 'organizer'), createEvent);
router.post('/:id/attendance', protect, authorize('admin', 'organizer'), markAttendance);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateEventStatus);

// Student routes
router.post('/:id/register', protect, authorize('student'), registerForEvent);

module.exports = router;