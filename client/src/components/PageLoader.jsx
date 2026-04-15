function PageLoader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse"></div>
            
            <div className="relative flex flex-col items-center">
                {/* Logo/Icon Container */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center p-0.5 animate-bounce shadow-2xl shadow-pink-500/20">
                        <div className="w-full h-full bg-[#050505] rounded-[1.4rem] flex items-center justify-center overflow-hidden relative group">
                            <span className="text-4xl font-black text-white italic tracking-tighter">S</span>
                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-pink-500 shadow-[0_0_15px_pink] animate-scan-laser"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-2">Smart College</h2>
                    <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-bounce"></div>
                    </div>
                </div>
            </div>
            
            {/* Status bar at bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initialising Neural Link...</p>
            </div>
        </div>
    );
}

export default PageLoader;
