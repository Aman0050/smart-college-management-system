import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import AttendanceScanner from '../components/AttendanceScanner';

const ScanAttendancePage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const handleScan = async (token) => {
        setLoading(true);
        try {
            const res = await api.post('/events/attendance/mark', { token });
            setResult({ success: true, message: res.data.message });
            toast.success(res.data.message);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/student');
            }, 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to mark attendance';
            setResult({ success: false, message: errorMsg });
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-lg mx-auto px-4 py-8 text-center">
            <button
                onClick={() => navigate('/student')}
                className="text-slate-400 hover:text-white mb-8 flex items-center gap-2 transition-colors mx-auto text-sm font-medium"
            >
                &larr; Back to Dashboard
            </button>

            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
                
                <h1 className="text-3xl font-extrabold text-white mb-2 italic tracking-tighter uppercase">SCAN & VERIFY</h1>
                <p className="text-slate-400 mb-8 text-sm">Scan the secure QR code provided by your teacher to record session attendance.</p>

                {result ? (
                    <div className={`p-8 rounded-2xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                        <div className="text-4xl mb-4">{result.success ? '✅' : '❌'}</div>
                        <h3 className="text-xl font-bold mb-2">{result.success ? 'Success!' : 'Failed'}</h3>
                        <p className="text-sm font-medium">{result.message}</p>
                        <button 
                            onClick={() => setResult(null)} 
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
                                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-bold animate-pulse">Verifying Attendance...</p>
                            </div>
                        )}
                        <AttendanceScanner onScanSuccess={handleScan} />
                    </div>
                )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                    { label: 'Secure', icon: '🔒' },
                    { label: 'Instant', icon: '⚡' },
                    { label: 'Verified', icon: '💎' }
                ].map((item, i) => (
                    <div key={i} className="glass-panel p-4 rounded-2xl">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScanAttendancePage;
