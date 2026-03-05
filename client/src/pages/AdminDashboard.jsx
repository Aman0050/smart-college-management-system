import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events'); // events, users, analytics

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const fetchData = async () => {
        try {
            const [eventsRes, usersRes, analyticsRes] = await Promise.all([
                api.get('/events'),
                api.get('/users'),
                api.get('/users/analytics')
            ]);
            setEvents(eventsRes.data);
            setUsers(usersRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (eventId, status) => {
        try {
            await api.put(`/events/${eventId}/status`, { status });
            // Refresh list locally
            setEvents(events.map(ev => ev._id === eventId ? { ...ev, status } : ev));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Control Panel</h1>
                <p className="text-slate-400">Review and manage all system events, users, and analytics.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Event Approvals
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    System Analytics
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* EVENTS TAB */}
                    {activeTab === 'events' && (
                        <div className="glass-panel rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-semibold text-white">Event Approval Queue</h2>
                            </div>

                            {events.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">No events found in the system.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-slate-300 text-sm uppercase tracking-wider">
                                                <th className="p-4 font-medium border-b border-white/10">Event Title</th>
                                                <th className="p-4 font-medium border-b border-white/10">Date & Location</th>
                                                <th className="p-4 font-medium border-b border-white/10">Organizer</th>
                                                <th className="p-4 font-medium border-b border-white/10">Status</th>
                                                <th className="p-4 font-medium border-b border-white/10 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {events.map((event) => (
                                                <tr key={event._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-medium text-white">{event.title}</td>
                                                    <td className="p-4 text-slate-400">
                                                        {new Date(event.date).toLocaleDateString()} • {event.location}
                                                    </td>
                                                    <td className="p-4 text-slate-400">{event.organizer?.name || 'Unknown'}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${event.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                                            event.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                                                'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                                            }`}>
                                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        {event.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(event._id, 'approved')}
                                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(event._id, 'rejected')}
                                                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-lg shadow-rose-500/20"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="glass-panel rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-semibold text-white">Registered Users</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-slate-300 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-medium border-b border-white/10">Name</th>
                                            <th className="p-4 font-medium border-b border-white/10">Email</th>
                                            <th className="p-4 font-medium border-b border-white/10">Role</th>
                                            <th className="p-4 font-medium border-b border-white/10">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {users.map((u) => (
                                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium text-white">{u.name}</td>
                                                <td className="p-4 text-slate-400">{u.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : u.role === 'organizer' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-500/20 text-slate-300'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Users</div>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                    {analytics.totalUsers || 0}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Students</div>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                                    {analytics.studentCount || 0}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Organizers</div>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                    {analytics.organizerCount || 0}
                                </div>
                            </div>
                            {/* Static Total Events Stat based on fetched events */}
                            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Events</div>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    {events.length}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminDashboard;

