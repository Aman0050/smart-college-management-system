const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        // If user is a student, only show approved events.
        // If admin/organizer, might want to show all. 
        // For simplicity, public route just shows approved events
        const query = req.user && req.user.role !== 'student' ? {} : { status: 'approved' };

        const events = await Event.find(query).populate('organizer', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
const createEvent = async (req, res) => {
    try {
        // Media upload will set req.file or req.body.media
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

module.exports = {
    getEvents,
    createEvent,
    updateEventStatus,
    registerForEvent,
    markAttendance
};