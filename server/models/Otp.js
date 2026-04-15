const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }, // OTP expires after 5 minutes
    // We can also temporarily store the user data pending registration
    pendingUser: { type: Object }
});

module.exports = mongoose.model('Otp', otpSchema);
