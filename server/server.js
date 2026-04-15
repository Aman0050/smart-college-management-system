const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors());
app.use(express.json());

// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Auth routes get stricter rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many login attempts, please try again after 15 minutes.' },
});
app.use('/api/auth', authLimiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/certificates', certificateRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        name: 'Smart College Management System API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});