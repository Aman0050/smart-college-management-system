import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
            <div className="text-center max-w-lg">
                {/* Glow */}
                <div className="relative inline-block mb-8 group">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-[80px] group-hover:bg-pink-500/40 transition-all duration-700"></div>
                    <div className="relative text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 animate-pulse tracking-tighter">
                        404
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-scan-laser"></div>
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase tracking-tight">Access Denied</h1>
                <p className="text-slate-400 mb-10 leading-relaxed max-w-sm mx-auto font-medium">
                    The requested node <span className="text-pink-500 font-mono">"{window.location.pathname}"</span> does not exist in the current neural network.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-500/25"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/courses"
                        className="px-6 py-3 glass-panel text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
