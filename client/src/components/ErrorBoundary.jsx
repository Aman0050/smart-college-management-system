import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] relative overflow-hidden border-rose-500/20 shadow-2xl shadow-rose-900/10">
                        {/* Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto mb-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-rose-500/10">
                                ⚠️
                            </div>
                            
                            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">System Leak Detected</h1>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                An unexpected exception occurred. The neural link has been temporarily suspended to prevent further data corruption.
                            </p>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="mb-8 p-4 bg-black/40 border border-white/5 rounded-2xl text-left overflow-auto max-h-[200px]">
                                    <p className="text-rose-400 font-mono text-[10px] uppercase mb-2 font-black">Crash Report:</p>
                                    <pre className="text-xs text-slate-500 font-mono italic">
                                        {this.state.error?.toString()}
                                    </pre>
                                </div>
                            )}

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-rose-500/30 active:scale-95"
                            >
                                Reboot System
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
