import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import QRCode from 'react-qr-code';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Defensive check for QRCode to prevent "Element type is invalid" crash
const QRCodeComponent = QRCode?.default || QRCode;

function CourseManage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('attendance');
    const [stats, setStats] = useState({ present: 0, total: 0 });
    const [registrations, setRegistrations] = useState([]);
    const [qrToken, setQrToken] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchDetails = async () => {
        try {
            const [eventRes, regRes] = await Promise.all([
                api.get(`/events/${id}`),
                api.get(`/events/${id}/registrations`)
            ]);

            setEvent(eventRes.data);
            setStats({
                present: eventRes.data.attendeesCount || 0,
                total: eventRes.data.registrationsCount || 0
            });
            setRegistrations(regRes.data.registrations || []);
        } catch (error) {
            toast.error("Failed to fetch course details");
            navigate('/teacher');
        } finally {
            setLoading(false);
        }
    };

    const generateToken = async () => {
        try {
            const res = await api.get(`/events/${id}/attendance-token`);
            setQrToken(res.data.token);
            setTimeLeft(30);
        } catch (error) {
            toast.error("Failed to generate secure QR token");
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'organizer') {
            navigate('/');
            return;
        }
        fetchDetails();
    }, [id]);

    // QR Logic
    useEffect(() => {
        if (activeTab === 'live') {
            generateToken();
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        generateToken();
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    // Polling for stats when in live session
    useEffect(() => {
        if (activeTab === 'live') {
            const poll = setInterval(async () => {
                try {
                    const res = await api.get(`/events/${id}`);
                    setStats({
                        present: res.data.attendeesCount || 0,
                        total: res.data.registrationsCount || 0
                    });
                } catch (e) {}
            }, 3000);
            return () => clearInterval(poll);
        }
    }, [activeTab, id]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const res = await api.post(`/events/${id}/attendees/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.message || "Attendance list updated successfully!");
            fetchDetails(); // Refresh stats
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to process CSV file");
        } finally {
            setUploadLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) return <div className="pt-20"><LoadingSkeleton type="details" /></div>;

    return (
        <div className="animate-fade-in pb-20">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <button onClick={() => navigate('/teacher')} className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 transition-all text-sm font-bold uppercase tracking-widest">
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight">{event?.title}</h1>
                    <p className="text-slate-400 mt-2">Manage course participation and attendance tracking.</p>
                </div>
                <div className="hidden sm:flex gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl text-center">
                        <div className="text-2xl font-black text-pink-500">{stats.present}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Present Today</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-8 border-b border-white/5 pb-4 overflow-x-auto selection:bg-pink-500/30">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'attendance' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    📋 Attendance Records
                </button>
                <button
                    onClick={() => setActiveTab('live')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'live' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    Live QR Session
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'upload' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    📤 Data Upload
                </button>
            </div>

            {activeTab === 'attendance' && (
                <div className="space-y-8 animate-slide-up">
                    <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-full blur-2xl"></div>
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-2xl">📊</div>
                        <h2 className="text-xl font-bold text-white mb-2">Participation Overview</h2>
                        <p className="text-slate-400 max-w-sm mb-8">Currently <b>{stats.present}</b> out of <b>{stats.total}</b> registered students have been marked as present.</p>
                        
                        <button 
                            onClick={() => setActiveTab('live')}
                            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
                        >
                            Start Live Session
                        </button>
                    </div>

                    <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center gap-3">
                            <span className="text-xl">📋</span>
                            <h3 className="text-lg font-bold text-white">Student Roster</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase font-black tracking-widest text-slate-500 bg-white/[0.02]">
                                        <th className="px-8 py-5">Student Name</th>
                                        <th className="px-8 py-5">Email</th>
                                        <th className="px-8 py-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {registrations.length > 0 ? (
                                        registrations.map((reg) => (
                                            <tr key={reg._id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-xs font-bold text-pink-400">
                                                            {reg.user?.name?.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-200">{reg.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-slate-400">{reg.user?.email}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        reg.status === 'attended' 
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                                        : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${reg.status === 'attended' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                                                        {reg.status === 'attended' ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-12 text-center text-slate-500 italic">No registrations found for this course.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="max-w-xl mx-auto">
                    <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white mb-2">Dynamic Attendance QR</h2>
                            <p className="text-slate-400 text-sm">Students can scan this from their mobile to mark attendance.</p>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] inline-block mb-10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-pink-500/20 rounded-[2rem] filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {qrToken ? (
                                <QRCodeComponent value={qrToken} size={240} className="relative z-10" />
                            ) : (
                                <div className="w-[240px] h-[240px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-300">Generating...</div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-pink-400">
                                Token expires in {timeLeft} seconds
                            </p>
                            <p className="text-[10px] text-slate-500 mt-2 italic">
                                Use a 30s rotation for maximum security against static image sharing.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'upload' && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-panel p-10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/10 rounded-br-full blur-2xl"></div>
                        
                        <h2 className="text-2xl font-bold text-white mb-6">Bulk Attendance Upload</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Upload a <b>.csv</b> file containing a list of student emails. This will automatically mark all matched students as attended for this course.
                        </p>

                        <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-12 text-center group hover:border-pink-500/50 transition-colors">
                            <input 
                                type="file" 
                                accept=".csv" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                                📁
                            </div>

                            <p className="text-sm font-medium text-slate-300 mb-6">
                                {uploadLoading ? 'Processing file...' : 'CSV file must include an "email" column'}
                            </p>

                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadLoading}
                                className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
                            >
                                {uploadLoading ? 'Uploading...' : 'Choose CSV File'}
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-pink-500/5 rounded-xl border border-pink-500/10">
                            <h4 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-2">CSV Format Example:</h4>
                            <div className="text-[10px] font-mono text-slate-500">
                                email<br />
                                student1@example.com<br />
                                student2@example.com
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseManage;
