import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

function TeacherDashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user || user.role !== 'organizer') {
        return <Navigate to="/" replace />;
    }

    // If teacher is not approved, show pending message
    if (!user.isApproved) {
        return (
            <div className="animate-fade-in pb-12">
                <div className="max-w-2xl mx-auto mt-12">
                    <div className="glass-panel rounded-2xl p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-4xl">
                                ⏳
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-4">Account Pending Approval</h1>
                            <p className="text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
                                Your teacher account has been created but is awaiting admin approval. 
                                You'll be able to create and manage courses once an administrator reviews and approves your account.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                Waiting for admin approval
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-xs text-slate-500">If you believe this is taking too long, please contact the administration office.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const fetchMyEvents = async () => {
        try {
            const res = await api.get('/events');
            const myEvents = res.data.filter(ev => ev.organizer?._id === user._id || ev.organizer === user._id);
            setEvents(myEvents);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const approvedCount = events.filter(e => e.status === 'approved').length;
    const pendingCount = events.filter(e => e.status === 'pending').length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registrationsCount || 0), 0);
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendeesCount || 0), 0);

    return (
        <div className="animate-fade-in pb-12">
            {/* Welcome Banner */}
            <div className="relative glass-panel rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-pink-600/20 transition-all duration-700"></div>
                
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p className="text-pink-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 sm:mb-3">Teacher Panel</p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                            Hello, {user.name} 👋
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
                            Organize, manage, and track your courses in real-time with next-gen tools.
                        </p>
                    </div>
                    <Link
                        to="/teacher/create-course"
                        className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-95 group/btn"
                    >
                        <span className="text-xl group-hover/btn:rotate-90 transition-transform">+</span>
                        Create New Course
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            {!loading && events.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {[
                        { label: 'Total Courses', val: events.length, icon: '📅', color: 'from-pink-400 to-rose-400' },
                        { label: 'Approved', val: approvedCount, icon: '✅', color: 'from-rose-400 to-fuchsia-400' },
                        { label: 'Registrations', val: totalRegistrations, icon: '👥', color: 'from-amber-400 to-orange-400' },
                        { label: 'Attendees', val: totalAttendees, icon: '🎯', color: 'from-fuchsia-400 to-pink-400' },
                    ].map((s, i) => (
                        <div key={i} className="glass-panel p-5 rounded-2xl text-center hover:bg-white/5 transition-all group">
                            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-1 group-hover:scale-110 transition-transform bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }}>
                                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${s.color}`}>
                                    {s.val}
                                </span>
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pending alert */}
            {pendingCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
                    <span className="text-amber-400 text-lg">⏳</span>
                    <span className="text-amber-300 text-sm font-medium">{pendingCount} course{pendingCount > 1 ? 's' : ''} awaiting admin approval</span>
                </div>
            )}

            <h2 className="text-xl font-semibold text-white mb-6">My Courses</h2>

            {loading ? (
                <LoadingSkeleton type="card" count={3} />
            ) : events.length === 0 ? (
                <div className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl border border-white/5">📋</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Courses Created Yet</h3>
                    <p className="text-slate-400 max-w-sm mb-6">You haven't created any courses. Start organizing to see them appear here.</p>
                    <Link to="/teacher/create-course" className="px-6 py-2 glass-panel text-pink-400 hover:text-pink-300 font-medium rounded-lg">Create One Now</Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            actionButton={
                                <Link
                                    to={`/courses/${event._id}/manage`}
                                    className="block w-full text-center py-2.5 rounded-xl border border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-medium transition-colors"
                                >
                                    Manage & Scan QR
                                </Link>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;
