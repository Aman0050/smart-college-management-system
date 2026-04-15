const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    qrCodeData: { type: String, required: true },
    status: { type: String, enum: ['registered', 'attended'], default: 'registered' },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
