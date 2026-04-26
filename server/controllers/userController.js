const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system analytics
// @route   GET /api/users/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const studentCount = await User.countDocuments({ role: 'student' });
        const organizerCount = await User.countDocuments({ role: 'organizer' });
        const pendingOrganizers = await User.countDocuments({ role: 'organizer', isApproved: false });

        const totalEvents = await Event.countDocuments();
        const approvedEvents = await Event.countDocuments({ status: 'approved' });
        const pendingEvents = await Event.countDocuments({ status: 'pending' });
        const rejectedEvents = await Event.countDocuments({ status: 'rejected' });

        const totalRegistrations = await Registration.countDocuments();
        const totalAttendance = await Registration.countDocuments({ status: 'attended' });
        const totalCertificates = await Certificate.countDocuments();

        res.json({
            totalUsers,
            studentCount,
            organizerCount,
            pendingOrganizers,
            totalEvents,
            approvedEvents,
            pendingEvents,
            rejectedEvents,
            totalRegistrations,
            totalAttendance,
            totalCertificates,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or reject an organizer
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveOrganizer = async (req, res) => {
    try {
        const { approved } = req.body; // true = approve, false = reject

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'organizer') {
            return res.status(400).json({ message: 'Only organizer accounts can be approved/rejected' });
        }

        user.isApproved = approved;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            message: approved ? 'Organizer approved successfully' : 'Organizer rejected',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Check if email is already taken by someone else
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isApproved: updatedUser.isApproved,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getAnalytics,
    approveOrganizer,
    updateProfile,
};
