const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const testPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'aman@student.edu';
        const password = 'student123';
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        console.log('User found:', user.email);
        console.log('Hashed password in DB:', user.password);
        
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testPassword();
