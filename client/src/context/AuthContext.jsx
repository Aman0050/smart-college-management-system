import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);

            // Route based on role
            routeByRole(response.data.role);
            return { success: true };
        } catch (error) {
            let msg = 'Login failed';
            if (!error.response) {
                msg = 'Network Error: Backend unreachable. Ensure server is running on port 5000.';
            } else if (error.response.data?.message) {
                msg = error.response.data.message;
            }
            return {
                success: false,
                message: msg
            };
        }
    };

    const sendOtp = async (email) => {
        try {
            await api.post('/auth/send-otp', { email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send verification code'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);

            routeByRole(response.data.role);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const googleLogin = async (googleToken, role = 'student') => {
        try {
            const response = await api.post('/auth/google', { googleToken, role });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);

            routeByRole(response.data.role);
            return { success: true };
        } catch (error) {
            console.error('Google Auth Call Failed:', error);
            let msg = 'Google Authentication failed';
            
            if (!error.response) {
                msg = 'Network Error: Backend unreachable. Ensure server is running on port 5000.';
            } else if (error.response.status === 500) {
                msg = error.response.data?.message || 'Google Verification Failed: Likely an invalid Client ID configuration.';
            } else if (error.response.data?.message) {
                msg = error.response.data.message;
            }

            return {
                success: false,
                message: msg
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const routeByRole = (role) => {
        if (role === 'admin') navigate('/admin');
        else if (role === 'organizer') navigate('/teacher');
        else navigate('/student'); // Student dashboard
    }

    return (
        <AuthContext.Provider value={{ user, login, register, sendOtp, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
