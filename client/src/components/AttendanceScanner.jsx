import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useToast } from './Toast';

const AttendanceScanner = ({ onScanSuccess }) => {
    const [scanning, setScanning] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner("attendance-reader", {
                qrbox: { width: 280, height: 280 },
                fps: 20,
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                rememberLastUsedCamera: true,
            });

            scanner.render(
                async (decodedText) => {
                    try {
                        scanner.clear();
                        setScanning(false);
                        if (onScanSuccess) {
                            await onScanSuccess(decodedText);
                        }
                    } catch (error) {
                        console.error("Scanner Error", error);
                        toast.error("Failed to process scan data");
                    }
                },
                (err) => {
                    // console.log(err);
                }
            );

            return () => {
                scanner.clear().catch(console.error);
            };
        }
    }, [scanning, onScanSuccess]);

    return (
        <div className="flex flex-col items-center">
            {!scanning ? (
                <button
                    onClick={() => setScanning(true)}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">📷</span>
                    Open Attendance Scanner
                </button>
            ) : (
                <div className="w-full max-w-sm">
                    <div id="attendance-reader" className="overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-black shadow-2xl"></div>
                    <button
                        onClick={() => setScanning(false)}
                        className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <p className="text-slate-500 text-[10px] mt-4 text-center uppercase tracking-widest font-bold">
                        Point your camera at the teacher's QR code
                    </p>
                </div>
            )}
        </div>
    );
};

export default AttendanceScanner;
