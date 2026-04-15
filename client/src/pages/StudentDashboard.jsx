import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QRCode from 'react-qr-code';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

// Defensive check for QRCode to prevent "Element type is invalid" crash
const QRCodeComponent = QRCode?.default || QRCode;

function StudentDashboard() {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null); // stores eventId being downloaded
    const [activeSection, setActiveSection] = useState('upcoming');
    const toast = useToast();

    if (!user || user.role !== 'student') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/events/my-registrations');
                setRegistrations(res.data);
            } catch (error) {
                console.error('Failed to fetch enrollments', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const now = new Date();
    const upcomingRegs = registrations.filter(r => r.event && new Date(r.event.date) >= now);
    const pastRegs = registrations.filter(r => r.event && new Date(r.event.date) < now);
    const attendedCount = registrations.filter(r => r.status === 'attended').length;
    const certificatesAvailable = registrations.filter(r => r.status === 'attended').length;

    const getTimeRemaining = (date) => {
        const diff = new Date(date) - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h`;
        return 'Starting soon';
    };

    const getGreeting = () => {
        const hour = now.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const handleDownloadCertificate = async (eventId, eventTitle) => {
        setDownloading(eventId);
        try {
            const response = await api.get(`/certificates/${eventId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${eventTitle.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error('Download error', error);
            toast.error('Failed to download certificate. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="animate-fade-in pb-12">
            {/* Welcome Banner */}
            <div className="relative glass-panel rounded-2xl p-6 sm:p-10 mb-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-rose-600/20 transition-all duration-700"></div>
                
                <div className="relative">
                    <p className="text-rose-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 sm:mb-4">{getGreeting()},</p>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
                        {user.name} 👋
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-lg max-w-xl leading-relaxed mb-6">
                        Track your academic journey, manage course enrollments, and download your verified certificates.
                    </p>
                    <Link
                        to="/scan-attendance"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-extrabold shadow-xl shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 group"
                    >
                        <span className="text-xl group-hover:rotate-12 transition-transform">📸</span>
                        Scan for Attendance
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {[
                    { label: 'Enrolled', val: registrations.length, color: 'from-rose-400 to-pink-400' },
                    { label: 'Attended', val: attendedCount, color: 'from-pink-400 to-rose-400' },
                    { label: 'Certificates', val: certificatesAvailable, color: 'from-rose-400 to-fuchsia-400' },
                    { label: 'Upcoming', val: upcomingRegs.length, color: 'from-amber-400 to-orange-400' },
                ].map((s, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl text-center hover:bg-white/5 transition-all group">
                        <div className={`text-3xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r ${s.color} group-hover:scale-110 transition-transform`}>
                            {s.val}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{s.label}</div>
                    </div>
                ))}
            </div>

            {loading ? (
                <LoadingSkeleton type="card" count={3} />
            ) : registrations.length === 0 ? (
                <div className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-4xl border border-white/5">
                        🎯
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Courses Yet</h3>
                    <p className="text-slate-400 max-w-sm mb-6">You haven't enrolled in any courses. Browse the catalog and start learning today!</p>
                    <Link to="/courses" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-500/25">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <>
                    {/* Section Tabs */}
                    <div className="flex gap-2 sm:gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide no-scrollbar">
                        {[
                            { id: 'upcoming', label: `Upcoming (${upcomingRegs.length})` },
                            { id: 'qrcodes', label: 'My QR Access' },
                            { id: 'past', label: `Completed (${pastRegs.length})` }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`whitespace-nowrap px-4 py-2.5 font-bold rounded-xl transition-all text-xs uppercase tracking-widest ${activeSection === tab.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Upcoming Events */}
                    {activeSection === 'upcoming' && (
                        <div className="space-y-4">
                            {upcomingRegs.length === 0 ? (
                                <div className="glass-panel p-8 text-center rounded-2xl text-slate-400">
                                    No upcoming courses. <Link to="/courses" className="text-pink-400 hover:text-pink-300 font-bold">Browse Catalog</Link>
                                </div>
                            ) : upcomingRegs.map(reg => (
                                <div key={reg._id} className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${reg.status === 'attended' ? 'bg-pink-400' : 'bg-amber-400'} animate-pulse`}></span>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                                                {reg.status === 'attended' ? 'Session Completed' : 'Enrolled'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{reg.event?.title}</h3>
                                        <p className="text-sm text-slate-400">
                                            {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBA'} • {reg.event?.time} • {reg.event?.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-sm font-medium">
                                            ⏳ {getTimeRemaining(reg.event?.date)}
                                        </div>
                                        <Link
                                            to={`/courses/${reg.event?._id}`}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* QR Codes */}
                    {activeSection === 'qrcodes' && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {registrations.filter(r => r.status === 'registered' && r.event && new Date(r.event.date) >= now).length === 0 ? (
                                <div className="col-span-full glass-panel p-8 text-center rounded-2xl text-slate-400">
                                    No active access codes. Enroll in upcoming courses to see your QR codes here.
                                </div>
                            ) : registrations.filter(r => r.status === 'registered' && r.event && new Date(r.event.date) >= now).map(reg => (
                                <div key={reg._id} className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center">
                                    <h4 className="text-sm font-bold text-white mb-4">{reg.event?.title}</h4>
                                    <div className="bg-white p-3 rounded-xl mb-4">
                                        <QRCodeComponent value={reg.qrCodeData} size={160} />
                                    </div>
                                    <p className="text-xs text-slate-500 break-all font-mono">{reg.qrCodeData}</p>
                                    <p className="text-xs text-slate-400 mt-2">Show this to the teacher for entry</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Past Events */}
                    {activeSection === 'past' && (
                        <div className="space-y-4">
                            {pastRegs.length === 0 ? (
                                <div className="glass-panel p-8 text-center rounded-2xl text-slate-400">
                                    No completed courses yet.
                                </div>
                            ) : pastRegs.map(reg => (
                                <div key={reg._id} className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${reg.status === 'attended' ? 'bg-pink-400' : 'bg-slate-500'}`}></span>
                                            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: reg.status === 'attended' ? '#34d399' : '#94a3b8' }}>
                                                {reg.status === 'attended' ? 'Attended' : 'Missed'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{reg.event?.title}</h3>
                                        <p className="text-sm text-slate-400">
                                            {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {reg.status === 'attended' && (
                                            <button
                                                onClick={() => handleDownloadCertificate(reg.event?._id, reg.event?.title)}
                                                disabled={downloading === reg.event?._id}
                                                className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-sm text-pink-300 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {downloading === reg.event?._id ? (
                                                    <span className="w-3 h-3 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></span>
                                                ) : '📄'} 
                                                Certificate
                                            </button>
                                        )}
                                        <Link
                                            to={`/courses/${reg.event?._id}`}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default StudentDashboard;
