import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import StatsCounter from '../components/StatsCounter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

function AdminDashboard() {
    const { user } = useAuth();
    const toast = useToast();
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events');

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState({ open: false, eventId: null, status: '', title: '' });
    const [orgConfirmModal, setOrgConfirmModal] = useState({ open: false, userId: null, approved: true, name: '' });

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
            setEvents(events.map(ev => ev._id === eventId ? { ...ev, status } : ev));
            toast.success(`Course ${status} successfully`);
        } catch (error) {
            toast.error("Failed to update status");
        }
        setConfirmModal({ open: false, eventId: null, status: '', title: '' });
    };

    const handleOrganizerApproval = async (userId, approved) => {
        try {
            await api.put(`/users/${userId}/approve`, { approved });
            setUsers(users.map(u => u._id === userId ? { ...u, isApproved: approved } : u));
            toast.success(approved ? 'Teacher approved successfully!' : 'Teacher rejected');
            // Refresh analytics
            const analyticsRes = await api.get('/users/analytics');
            setAnalytics(analyticsRes.data);
        } catch (error) {
            toast.error("Failed to update teacher status");
        }
        setOrgConfirmModal({ open: false, userId: null, approved: true, name: '' });
    };

    const pendingCount = events.filter(e => e.status === 'pending').length;
    const pendingOrganizers = users.filter(u => u.role === 'organizer' && !u.isApproved);

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-8 border-b border-white/5 pb-6">
                <h1 className="text-3xl font-extrabold text-white mb-2 uppercase tracking-tight">Admin Control Panel</h1>
                <p className="text-slate-400">Review and manage all university courses, faculty approvals, and system analytics.</p>
            </div>

            {/* Summary Cards */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCounter
                        end={analytics.totalUsers || 0}
                        label="Total Users"
                        color="emerald"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <StatsCounter
                        end={analytics.totalEvents || 0}
                        label="Courses"
                        color="amber"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    />
                    <StatsCounter
                        end={analytics.totalRegistrations || 0}
                        label="Enrollments"
                        color="blue"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                    />
                    <StatsCounter
                        end={analytics.totalCertificates || 0}
                        label="Certificates"
                        color="rose"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                </div>
            )}

            {/* Alerts */}
            {pendingCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 mb-4 flex items-center gap-3">
                    <span className="text-amber-400 text-lg">⚠️</span>
                    <span className="text-amber-300 text-sm font-medium">{pendingCount} course{pendingCount !== 1 ? 's' : ''} awaiting approval</span>
                </div>
            )}
            {pendingOrganizers.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
                    <span className="text-orange-400 text-lg">👤</span>
                    <span className="text-orange-300 text-sm font-medium">{pendingOrganizers.length} teacher{pendingOrganizers.length !== 1 ? 's' : ''} awaiting account approval</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/5 pb-4 overflow-x-auto selection:bg-pink-500/30">
                {[
                    { key: 'events', label: 'Course Approvals' },
                    { key: 'organizers', label: `Teacher Approvals (${pendingOrganizers.length})` },
                    { key: 'users', label: 'User Directory' },
                    { key: 'analytics', label: 'Campus Analytics' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSkeleton type="table" count={5} />
            ) : (
                <>
                    {/* EVENTS TAB */}
                    {activeTab === 'events' && (
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Course Approval Queue</h2>
                                <span className="text-xs text-slate-500 uppercase font-black tracking-widest">{events.length} system courses</span>
                            </div>

                            {events.length === 0 ? (
                                <div className="p-20 text-center text-slate-500 italic">No courses currently in the system.</div>
                            ) : (
                                <div className="p-4 lg:p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                                    <th className="p-5 border-b border-white/5">Course Information</th>
                                                    <th className="p-5 border-b border-white/5">Teacher</th>
                                                    <th className="p-5 border-b border-white/5">Enrolled</th>
                                                    <th className="p-5 border-b border-white/5">Status</th>
                                                    <th className="p-5 border-b border-white/5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {events.map((event) => (
                                                    <tr key={event._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                                        <td className="p-5">
                                                            <p className="font-bold text-white uppercase text-xs mb-1 group-hover:text-pink-500 transition-all">{event.title}</p>
                                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                                                        </td>
                                                        <td className="p-5 text-slate-400 font-medium">{event.organizer?.name || 'Unknown'}</td>
                                                        <td className="p-5 text-slate-500 font-mono italic">{event.registrationsCount || 0}</td>
                                                        <td className="p-5">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${event.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                                event.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                                }`}>
                                                                {event.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            {event.status === 'pending' ? (
                                                                <div className="inline-flex gap-2">
                                                                    <button
                                                                        onClick={() => setConfirmModal({ open: true, eventId: event._id, status: 'approved', title: event.title })}
                                                                        className="w-8 h-8 flex items-center justify-center bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                                                                    >
                                                                        ✓
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setConfirmModal({ open: true, eventId: event._id, status: 'rejected', title: event.title })}
                                                                        className="w-8 h-8 flex items-center justify-center bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-600 uppercase font-black">Finalized</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TEACHER APPROVALS TAB */}
                    {activeTab === 'organizers' && (
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Teacher Verification</h2>
                                <span className="text-xs text-slate-500 uppercase font-black tracking-widest">{users.filter(u => u.role === 'organizer').length} total faculty</span>
                            </div>

                            {users.filter(u => u.role === 'organizer').length === 0 ? (
                                <div className="p-20 text-center text-slate-500 italic">No teacher accounts found.</div>
                            ) : (
                                <div className="p-4 lg:p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                                    <th className="p-5 border-b border-white/5">Teacher Details</th>
                                                    <th className="p-5 border-b border-white/5 text-left">Academic Email</th>
                                                    <th className="p-5 border-b border-white/5 uppercase tracking-tighter">Status</th>
                                                    <th className="p-5 border-b border-white/5 text-right">Portal Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-left">
                                                {users.filter(u => u.role === 'organizer').map((org) => (
                                                    <tr key={org._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                                        <td className="p-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-xs text-white font-black group-hover:scale-110 transition-transform">
                                                                    {org.name?.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <span className="font-bold text-white uppercase text-xs">{org.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-slate-400 italic text-xs">{org.email}</td>
                                                        <td className="p-5">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${org.isApproved 
                                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                            }`}>
                                                                {org.isApproved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            {!org.isApproved ? (
                                                                <div className="inline-flex gap-2">
                                                                    <button
                                                                        onClick={() => setOrgConfirmModal({ open: true, userId: org._id, approved: true, name: org.name })}
                                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/10"
                                                                    >
                                                                        Grant Access
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setOrgConfirmModal({ open: true, userId: org._id, approved: false, name: org.name })}
                                                                        className="px-4 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all hover:bg-rose-600 hover:text-white"
                                                                    >
                                                                        Deny
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Academic Active
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider">User Directory</h2>
                                <span className="text-xs text-slate-500 uppercase font-black tracking-widest">{users.length} total members</span>
                            </div>
                            
                            <div className="p-4 lg:p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                                <th className="p-5 border-b border-white/5">Member Name</th>
                                                <th className="p-5 border-b border-white/5">Academy Role</th>
                                                <th className="p-5 border-b border-white/5 text-right tracking-tighter">Joined On</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:border-pink-500/50 transition-colors">
                                                                {u.name?.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-white uppercase text-[11px] group-hover:text-pink-400 transition-colors tracking-tight">{u.name}</p>
                                                                <p className="text-[10px] text-slate-500 italic lowercase tracking-wider">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' : u.role === 'organizer' ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                                                            {u.role === 'organizer' ? 'Teacher' : u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatsCounter end={analytics.totalUsers || 0} label="System Users" color="emerald" />
                                <StatsCounter end={analytics.studentCount || 0} label="Students" color="blue" />
                                <StatsCounter end={analytics.organizerCount || 0} label="Teachers" color="amber" />
                                <StatsCounter end={analytics.pendingOrganizers || 0} label="Pending Faculty" color="rose" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatsCounter end={analytics.approvedEvents || 0} label="Live Courses" color="emerald" />
                                <StatsCounter end={analytics.pendingEvents || 0} label="Approval Backlog" color="amber" />
                                <StatsCounter end={analytics.totalRegistrations || 0} label="Total Enrollments" color="blue" />
                                <StatsCounter end={analytics.totalAttendance || 0} label="Recorded Attendance" color="rose" />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Event Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.open}
                title={`${confirmModal.status === 'approved' ? 'Approve' : 'Reject'} Course?`}
                message={`Are you sure you want to ${confirmModal.status === 'approved' ? 'approve' : 'reject'} "${confirmModal.title}"? This will update the course catalog immediately.`}
                confirmText={confirmModal.status === 'approved' ? 'Approve' : 'Reject'}
                confirmColor={confirmModal.status === 'approved' ? 'green' : 'red'}
                onConfirm={() => handleStatusUpdate(confirmModal.eventId, confirmModal.status)}
                onCancel={() => setConfirmModal({ open: false, eventId: null, status: '', title: '' })}
            />

            {/* Organizer Confirmation Modal */}
            <ConfirmModal
                isOpen={orgConfirmModal.open}
                title={orgConfirmModal.approved ? 'Approve Faculty Member?' : 'Reject Request?'}
                message={orgConfirmModal.approved
                    ? `By approving "${orgConfirmModal.name}", you grant them full teacher privileges to create courses and manage attendance.`
                    : `Rejecting "${orgConfirmModal.name}" will prevent them from accessing teacher features.`
                }
                confirmText={orgConfirmModal.approved ? 'Approve' : 'Reject'}
                confirmColor={orgConfirmModal.approved ? 'green' : 'red'}
                onConfirm={() => handleOrganizerApproval(orgConfirmModal.userId, orgConfirmModal.approved)}
                onCancel={() => setOrgConfirmModal({ open: false, userId: null, approved: true, name: '' })}
            />
        </div>
    );
}

export default AdminDashboard;
