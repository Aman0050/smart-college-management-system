import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function EventDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Feedback State
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const res = await api.get('/events');
                const found = res.data.find(e => e._id === id);
                if (found) {
                    setEvent(found);
                } else {
                    setMessage({ text: 'Event not found', type: 'error' });
                }
            } catch (error) {
                setMessage({ text: 'Error loading event details', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setActionLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await api.post(`/events/${id}/register`);
            setMessage({ text: 'Successfully registered for this event!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Registration failed', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDownloadCertificate = async () => {
        setActionLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${event.title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setMessage({ text: 'Certificate downloaded!', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Certificate not available yet or you did not attend.', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await api.post(`/events/${id}/feedback`, feedbackData);
            setMessage({ text: 'Thank you for your feedback! It has been submitted to the organizer.', type: 'success' });
            setShowFeedback(false);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to submit feedback', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>;
    }

    if (!event) {
        return (
            <div className="glass-panel p-16 text-center max-w-2xl mx-auto rounded-2xl flex flex-col items-center mt-12">
                <h3 className="text-2xl font-bold text-white mb-2">Event Not Found</h3>
                <p className="text-slate-400 mb-6">{message.text}</p>
                <button onClick={() => navigate('/events')} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">Back to Events</button>
            </div>
        );
    }

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="animate-fade-in pb-12 max-w-4xl mx-auto px-4 sm:px-6">

            <button
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm font-medium"
            >
                &larr; Back
            </button>

            {message.text && (
                <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 relative">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

                {/* Event Header */}
                <div className="p-8 sm:p-12 border-b border-white/10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        {event.status === 'approved' ? 'Active Event' : event.status}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">{event.title}</h1>

                    <div className="grid sm:grid-cols-2 gap-6 text-slate-300 font-medium">
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">🕒</div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Date & Time</p>
                                <p>{formattedDate} • {event.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">📍</div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Location</p>
                                <p>{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Description & Actions */}
                <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-12">
                    <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-white mb-4">About this Event</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-10">
                            {event.description}
                        </p>

                        {/* Feedback Module (Inline rendering if active) */}
                        {showFeedback && (
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-fade-in mt-8">
                                <h4 className="text-lg font-bold text-white mb-4">Provide Feedback</h4>
                                <form onSubmit={submitFeedback} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-2">Rating ({feedbackData.rating}/5)</label>
                                        <input
                                            type="range" min="1" max="5"
                                            value={feedbackData.rating}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, rating: e.target.value })}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>Poor</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-2">Comments</label>
                                        <textarea
                                            required
                                            value={feedbackData.comment}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                                            rows="4"
                                            placeholder="What did you think of the event?"
                                        ></textarea>
                                    </div>
                                    <div className="flex gap-3 justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFeedback(false)}
                                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>

                    <div className="md:w-1/3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h4 className="text-lg font-bold text-white mb-2">Actions</h4>
                            <p className="text-sm text-slate-400 mb-6">Secure your spot or download your certificate if you attended.</p>

                            <div className="space-y-3">
                                {(!user || user.role === 'student') && (
                                    <>
                                        <button
                                            onClick={handleRegister}
                                            disabled={actionLoading}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                                        >
                                            {actionLoading ? 'Processing...' : 'Register for Event'}
                                        </button>

                                        <button
                                            onClick={handleDownloadCertificate}
                                            disabled={actionLoading}
                                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl font-medium transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                                        >
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            Download Certificate
                                        </button>

                                        {user && !showFeedback && (
                                            <button
                                                onClick={() => setShowFeedback(true)}
                                                className="w-full py-2.5 px-4 mt-2 bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 rounded-xl font-medium transition-all text-sm"
                                            >
                                                Leave Feedback
                                            </button>
                                        )}
                                    </>
                                )}

                                {user && user.role === 'organizer' && (
                                    <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
                                        Organizers manage events via the Organizer Dashboard.
                                    </div>
                                )}

                                {user && user.role === 'admin' && (
                                    <div className="text-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 text-sm">
                                        Admins govern events via the Admin Control Panel.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
