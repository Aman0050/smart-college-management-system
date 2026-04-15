import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

function CourseCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: ''
    });

    if (!user || user.role !== 'organizer') return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/events', formData);
            toast.success("Course objective created! Awaiting admin approval.");
            navigate('/teacher');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-3xl mx-auto py-8">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/10 rounded-br-full blur-2xl"></div>
                
                <h1 className="text-3xl font-extrabold text-white mb-2 relative">Create New Course</h1>
                <p className="text-slate-400 mb-10 relative italic">Fill in the details to propose a new academic course or event.</p>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 text-left">Course Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 transition-all"
                                placeholder="e.g. Advanced Quantum Computing"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 text-left">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 transition-all [color-scheme:dark]"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 text-left">Time</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 transition-all"
                                placeholder="e.g. 10:00 AM"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 text-left">Location / Classroom</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 transition-all"
                                placeholder="e.g. Hall A-102 or Online"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 text-left">Description</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 transition-all resize-none"
                                placeholder="Details about this course..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/teacher')}
                            className="flex-1 py-4 border border-white/10 text-slate-400 rounded-xl font-bold hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-pink-500/25 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CourseCreate;
