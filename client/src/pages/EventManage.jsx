import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';

function EventManage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState({ message: '', type: '' });

    if (!user || user.role !== 'organizer') {
        return <Navigate to="/" replace />;
    }

    // Fetch Event details to ensure it belongs to the organizer
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const res = await api.get('/events');
                const found = res.data.find(e => e._id === id);
                // Client side safety check
                if (found && (found.organizer === user._id || found.organizer?._id === user._id)) {
                    setEvent(found);
                } else {
                    // Not their event
                    navigate('/organizer');
                }
            } catch (error) {
                console.error("Error loading event", error);
                navigate('/organizer');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, navigate, user._id]);

    // QR Scanner Initialization
    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner("reader", {
                qrbox: { width: 250, height: 250 },
                fps: 5
            });

            scanner.render(
                async (decodedText) => {
                    scanner.clear();
                    setScanning(false);
                    await handleAttendanceScan(decodedText);
                },
                (err) => {
                    // Ignore scanning errors during detection
                }
            );

            return () => {
                scanner.clear().catch(console.error);
            };
        }
    }, [scanning]);

    const handleAttendanceScan = async (qrData) => {
        setScanResult({ message: 'Processing...', type: 'info' });
        try {
            const res = await api.post(`/events/${id}/attendance`, { qrCodeData: qrData });
            setScanResult({ message: '✅ ' + res.data.message, type: 'success' });
            // Clear success message after 3 seconds
            setTimeout(() => setScanResult({ message: '', type: '' }), 3000);
        } catch (error) {
            setScanResult({ message: '❌ ' + (error.response?.data?.message || 'Failed to verify QR Code'), type: 'error' });
            setTimeout(() => setScanResult({ message: '', type: '' }), 4000);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="animate-fade-in pb-12 max-w-4xl mx-auto px-4">

            <button
                onClick={() => navigate('/organizer')}
                className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm font-medium"
            >
                &larr; Back to Dashboard
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Manage Event</h1>
                <p className="text-slate-400">{event?.title}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Scanner Panel */}
                <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-[50px] opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        Mark Attendance
                    </h2>

                    {scanResult.message && (
                        <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center ${scanResult.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                                scanResult.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                                    'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                            }`}>
                            {scanResult.message}
                        </div>
                    )}

                    {!scanning ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <p className="text-slate-300 font-medium mb-6">Scan student QR codes to mark them present.</p>
                            <button
                                onClick={() => setScanning(true)}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
                            >
                                Start Scanner
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div id="reader" className="w-full bg-black rounded-xl overflow-hidden border border-white/10 mb-4 h-[300px]"></div>
                            <button
                                onClick={() => setScanning(false)}
                                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl font-medium transition-colors"
                            >
                                Cancel Scanning
                            </button>
                        </div>
                    )}

                    {/* Manual Fallback Option */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-slate-400 mb-3">Manual Override</p>
                        <form onSubmit={(e) => { e.preventDefault(); handleAttendanceScan(e.target.qrdata.value); e.target.reset(); }} className="flex gap-2">
                            <input type="text" name="qrdata" placeholder="Enter QR Payload" required className="flex-1 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                            <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors cursor-pointer">Submit</button>
                        </form>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="glass-panel w-full rounded-2xl p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6">Event Quick Stats</h2>

                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎟️</span>
                                <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Status</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${event?.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                                {event?.status.toUpperCase()}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-center">
                            <div className="text-slate-400 text-sm mb-1">Make sure you scan attendees upon entry. Only attended attendees can download their certificates.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EventManage;
