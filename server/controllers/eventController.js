const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const { Readable } = require('stream');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        // If user is a student, only show approved events.
        // If admin/organizer, show all.
        const query = req.user && req.user.role !== 'student' ? {} : { status: 'approved' };

        const events = await Event.find(query)
            .populate('organizer', 'name email')
            .sort({ date: -1 });

        // Attach registration and attendance counts to each event
        const eventsWithCounts = await Promise.all(
            events.map(async (event) => {
                const registrationsCount = await Registration.countDocuments({ event: event._id });
                const attendeesCount = await Registration.countDocuments({ event: event._id, status: 'attended' });
                return {
                    ...event.toObject(),
                    registrationsCount,
                    attendeesCount,
                };
            })
        );

        res.json(eventsWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const registrationsCount = await Registration.countDocuments({ event: event._id });
        const attendeesCount = await Registration.countDocuments({ event: event._id, status: 'attended' });

        // Get recent registrations (last 5)
        const recentRegistrations = await Registration.find({ event: event._id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            ...event.toObject(),
            registrationsCount,
            attendeesCount,
            recentRegistrations,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, media } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            media: media || 'no-photo.jpg',
            organizer: req.user._id,
            status: 'pending' // Admin needs to approve
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event status (Approve/Reject)
// @route   PUT /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = status;
        await event.save();

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private/Student
const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        // Check if event exists and is approved
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.status !== 'approved') {
            return res.status(400).json({ message: 'Cannot register for unapproved events' });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({ event: eventId, user: userId });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Generate basic QR code data string
        const qrCodeData = `${userId}-${eventId}-${Date.now()}`;

        const registration = await Registration.create({
            user: userId,
            event: eventId,
            qrCodeData,
            status: 'registered'
        });

        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark attendance for an event (Scan QR)
// @route   POST /api/events/:id/attendance
// @access  Private/Organizer
const markAttendance = async (req, res) => {
    try {
        const { qrCodeData } = req.body;
        const eventId = req.params.id;

        // Verify organizer owns this event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // In strict mode, only the organizer of the event can mark attendance
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to mark attendance for this event' });
        }

        const registration = await Registration.findOne({ event: eventId, qrCodeData });

        if (!registration) {
            return res.status(404).json({ message: 'Invalid QR code or registration not found' });
        }

        if (registration.status === 'attended') {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        registration.status = 'attended';
        await registration.save();

        res.json({ message: 'Attendance marked successfully', registration });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit feedback for an event
// @route   POST /api/events/:id/feedback
// @access  Private/Student
const submitFeedback = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;
        const { rating, comment } = req.body;

        // Must be registered for the event
        const registration = await Registration.findOne({ event: eventId, user: userId });
        if (!registration) {
            return res.status(404).json({ message: 'You are not registered for this event' });
        }

        // Check if feedback already submitted
        if (registration.feedback && registration.feedback.rating) {
            return res.status(400).json({ message: 'You have already submitted feedback for this event' });
        }

        registration.feedback = {
            rating: Number(rating),
            comment: comment || '',
        };
        await registration.save();

        res.json({ message: 'Feedback submitted successfully', feedback: registration.feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registrations for an event (for organizer view)
// @route   GET /api/events/:id/registrations
// @access  Private/Organizer
const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Verify organizer owns this event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view registrations for this event' });
        }

        const registrations = await Registration.find({ event: eventId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Calculate average rating from feedback
        const feedbackEntries = registrations.filter(r => r.feedback && r.feedback.rating);
        const avgRating = feedbackEntries.length > 0
            ? (feedbackEntries.reduce((sum, r) => sum + r.feedback.rating, 0) / feedbackEntries.length).toFixed(1)
            : null;

        res.json({
            registrations,
            stats: {
                total: registrations.length,
                attended: registrations.filter(r => r.status === 'attended').length,
                registered: registrations.filter(r => r.status === 'registered').length,
                avgRating,
                feedbackCount: feedbackEntries.length,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registrations for the current user (student)
// @route   GET /api/events/my-registrations
// @access  Private/Student
const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;

        const registrations = await Registration.find({ user: userId })
            .populate({
                path: 'event',
                populate: { path: 'organizer', select: 'name email' }
            })
            .sort({ createdAt: -1 });

        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate dynamic attendance token for QR code (Faculty)
// @route   GET /api/events/:id/attendance-token
// @access  Private/Organizer
const generateAttendanceToken = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Verify ownership
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate a token valid for 30 seconds
        const token = jwt.sign(
            { eventId: event._id, type: 'attendance_session' },
            process.env.JWT_SECRET,
            { expiresIn: '30s' }
        );

        res.json({ token, expiresIn: 30 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark attendance by student (Scan QR)
// @route   POST /api/events/attendance/mark
// @access  Private/Student
const markSelfAttendance = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user._id;

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'QR Code expired or invalid. Please scan again.' });
        }

        if (decoded.type !== 'attendance_session') {
            return res.status(400).json({ message: 'Invalid token type' });
        }

        const eventId = decoded.eventId;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event/Class not found' });
        }

        // Check if student is already registered
        let registration = await Registration.findOne({ event: eventId, user: userId });

        if (!registration) {
            // Auto-register the student
            const qrCodeData = `${userId}-${eventId}-${Date.now()}`;
            registration = await Registration.create({
                user: userId,
                event: eventId,
                qrCodeData,
                status: 'attended'
            });
            return res.status(201).json({ 
                message: 'Attendance marked successfully (Auto-registered)', 
                registration 
            });
        }

        if (registration.status === 'attended') {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        registration.status = 'attended';
        await registration.save();

        res.json({ message: 'Attendance marked successfully', registration });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload attendance via CSV (Teacher)
// @route   POST /api/events/:id/attendees/upload
// @access  Private/Organizer
const uploadAttendanceCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a CSV file' });
        }

        const eventId = req.params.id;
        const results = [];
        const stream = Readable.from(req.file.buffer.toString());

        // Parse CSV
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    let updatedCount = 0;
                    const errors = [];

                    for (const row of results) {
                        const email = row.email || row.Email || row.EMAIL;
                        if (!email) continue;

                        // Find user by email
                        const foundUser = await User.findOne({ email: email.trim().toLowerCase() });
                        if (!foundUser) {
                            errors.push(`User not found: ${email}`);
                            continue;
                        }

                        // Find or create registration
                        let registration = await Registration.findOne({ event: eventId, user: foundUser._id });
                        
                        if (!registration) {
                            // Automatically register them if they aren't registered
                            registration = await Registration.create({
                                event: eventId,
                                user: foundUser._id,
                                status: 'attended',
                                qrCodeData: `MANUAL-${foundUser._id}-${Date.now()}`
                            });
                            updatedCount++;
                        } else if (registration.status !== 'attended') {
                            registration.status = 'attended';
                            await registration.save();
                            updatedCount++;
                        }
                    }

                    res.json({
                        success: true,
                        message: `Successfully marked ${updatedCount} students as present.`,
                        errors: errors.length > 0 ? errors : undefined
                    });
                } catch (error) {
                    res.status(500).json({ message: 'Error processing student list: ' + error.message });
                }
            });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEventStatus,
    registerForEvent,
    markAttendance,
    submitFeedback,
    getEventRegistrations,
    getMyRegistrations,
    generateAttendanceToken,
    markSelfAttendance,
    uploadAttendanceCSV,
};