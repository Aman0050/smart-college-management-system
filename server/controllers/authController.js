const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

// Load Google Client ID from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// @desc    Authenticate with Google (Register & Login unified)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const { googleToken, role } = req.body;

        // Verify the Google token cryptographically
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google Token' });
        }

        const { email, name, email_verified } = payload;

        if (!email_verified) {
            return res.status(400).json({ message: 'Google account email must be verified' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Register them!
            // We set a random secure password since they use Google to login
            const secureRandomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            user = await User.create({
                name,
                email,
                password: secureRandomPassword,
                role: role || 'student',
            });
        }

        // Issue our standard JWT Token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);

        // Return a more descriptive error message if available
        const errorMessage = error.message?.includes('audience')
            ? 'Google Client ID mismatch. Please check your configuration.'
            : 'Failed to verify Google Account. Please ensure your Client ID is correct.';

        res.status(500).json({ message: errorMessage });
    }
};

// @desc    Send OTP for manual verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database (expires in 5m as per model)
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #DB2777; text-align: center;">Smart College Verification</h2>
                <p>Hello,</p>
                <p>To ensure the security of your account, please enter the following code to verify your academic email address:</p>
                <div style="background: #FDF2F8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #FBCFE8;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #BE185D;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #6B7280; text-align: center;">This code will expire in 5 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #9CA3AF; text-align: center;">If you didn't request this code, please ignore this email.</p>
            </div>
        `;

        await sendEmail({
            email,
            subject: 'Smart College: Your Verification Code',
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully to ' + email });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Failed to send verification code' });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // For manual logins if still used (or can be removed if strictly Google)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            console.log(`Login successful for: ${email}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id),
            });
        } else {
            console.warn(`Login failed for: ${email} - Invalid credentials`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    googleAuth,
    sendOtp,
    registerUser,
    loginUser,
    getUserProfile,
};