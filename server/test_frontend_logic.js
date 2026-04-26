const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testLogin = async () => {
    try {
        console.log('Attempting login for aman@student.edu...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'aman@student.edu',
            password: 'student123'
        });
        console.log('Login successful!');
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
            if (error.code) console.error('Error Code:', error.code);
        }
    }
};

testLogin();
