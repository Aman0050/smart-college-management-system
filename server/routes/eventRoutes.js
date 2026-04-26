const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEventStatus,
    registerForEvent,
    markAttendance,
    submitFeedback,
    getMyRegistrations,
    generateAttendanceToken,
    markSelfAttendance,
    getEventRegistrations,
    uploadAttendanceCSV,
} = require('../controllers/eventController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

// Student: get my registrations (must be before /:id to avoid route conflict)
router.get('/my-registrations', protect, authorize('student'), getMyRegistrations);

// Public route to get events (optionalProtect so admins/organizers see all, students see approved only)
router.get('/', optionalProtect, getEvents);

// Get single event
router.get('/:id', getEventById);

// Organizer routes
router.post('/', protect, authorize('admin', 'organizer'), createEvent);
router.post('/:id/attendance', protect, authorize('admin', 'organizer'), markAttendance);
router.get('/:id/registrations', protect, authorize('admin', 'organizer'), getEventRegistrations);
router.get('/:id/attendance-token', protect, authorize('admin', 'organizer'), generateAttendanceToken);
router.post('/:id/attendees/upload', protect, authorize('admin', 'organizer'), upload.single('csvFile'), uploadAttendanceCSV);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateEventStatus);

// Student routes
router.post('/attendance/mark', protect, authorize('student'), markSelfAttendance);
router.post('/:id/register', protect, authorize('student'), registerForEvent);
router.post('/:id/feedback', protect, authorize('student'), submitFeedback);

module.exports = router;