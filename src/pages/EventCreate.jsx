import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

function EventCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!user || user.role !== 'organizer') {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app with file uploads this would be FormData,
            // but according to the backend, it currently accepts JSON body with an optional `media` key as text or handles upload separately.
            // Based on eventController.js: req.body has the fields. Let's send a standard JSON request for now.
            await api.post('/events', formData);
            navigate('/organizer');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request event creation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in pb-12 max-w-2xl mx-auto">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/organizer')}
                    className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm"
                >
                    &larr; Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
                <p className="text-slate-400">Fill in the details for your new event. It will be submitted for admin approval.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 -z-10 translate-x-1/2 -translate-y-1/2"></div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Event Title</label>
                        <input
                            type="text" name="title" required className="w-full"
                            value={formData.title} onChange={handleChange}
                            placeholder="e.g. Annual Tech Symposium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea
                            name="description" required className="w-full min-h-[120px] resize-y"
                            value={formData.description} onChange={handleChange}
                            placeholder="Describe what the event is about..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                            <input
                                type="date" name="date" required className="w-full"
                                value={formData.date} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
                            <input
                                type="time" name="time" required className="w-full"
                                value={formData.time} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                        <input
                            type="text" name="location" required className="w-full"
                            value={formData.location} onChange={handleChange}
                            placeholder="e.g. Main Auditorium"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/organizer')}
                            className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 min-w-[140px]"
                        >
                            {loading ? 'Submitting...' : 'Submit to Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventCreate;
