import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [hasAttended, setHasAttended] = useState(false);

    const fetchEventDetails = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            // Note: API returns event, isRegistered, isAttended (but let's normalize)
            setEvent(res.data);
            
            // Check if user is registered for this specific event in their profile/list
            if (user && user.role === 'student') {
                const myRegs = await api.get('/events/my-registrations');
                const reg = myRegs.data.find(r => r.event._id === id);
                if (reg) {
                    setIsRegistered(true);
                    setHasAttended(reg.status === 'attended');
                }
            }
        } catch (error) {
            console.error("Failed to fetch course details", error);
            toast.error("Course not found or inaccessible");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [id, user]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setActionLoading(true);
        try {
            await api.post(`/events/${id}/register`);
            toast.success("Successfully enrolled in this course!");
            setIsRegistered(true);
            fetchEventDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="pt-20"><LoadingSkeleton type="details" /></div>;

    if (!event) return (
        <div className="pt-32 text-center text-slate-400">
            <h2 className="text-2xl font-bold mb-4 italic">Error 404: Course Not Found</h2>
            <button onClick={() => navigate('/courses')} className="text-pink-400 hover:underline">Return to Course Catalog</button>
        </div>
    );

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="animate-fade-in pb-20">
            <button onClick={() => navigate(-1)} className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 transition-all text-xs font-bold uppercase tracking-widest pt-4">
                &larr; Back
            </button>

            <div className="glass-panel overflow-hidden rounded-[2.5rem] relative">
                <div className="p-6 sm:p-10 lg:p-12 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-300 text-[10px] font-black uppercase tracking-widest">
                            {event.status === 'approved' ? 'Premium Course' : event.status}
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-8 sm:mb-10 leading-[1.1] tracking-tight">{event.title}</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 text-slate-300">
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">🕒</div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Schedule</p>
                                <p>{formattedDate} • {event.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">📍</div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Location</p>
                                <p>{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-12">
                    <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-white mb-4">Course Description</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-10">
                            {event.description}
                        </p>

                        {event.organizer && (
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-sm text-white font-bold uppercase">
                                    {event.organizer.name?.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Professor / Teacher</p>
                                    <p className="text-sm font-medium text-white">{event.organizer.name}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:w-1/3">
                        <div className="sticky top-24 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="text-white font-bold mb-6 relative">Enrollment</h4>
                            <div className="space-y-6 relative">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Course Fee</span>
                                    <span className="text-emerald-400 font-bold uppercase tracking-widest">Free</span>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    {isRegistered ? (
                                        <div className="w-full py-3 px-4 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-xl font-medium text-center text-sm">
                                            ✅ {hasAttended ? 'Course Completed' : 'Enrolled'}
                                        </div>
                                    ) : (
                                        <button onClick={handleRegister} disabled={actionLoading} className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50">
                                            {actionLoading ? 'Enrolling...' : 'Enroll in Course'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
