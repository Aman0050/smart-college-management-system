import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="animate-fade-in pb-20">

            {/* Hero Section */}
            <section className="relative px-6 py-24 sm:py-32 lg:px-8 flex flex-col items-center justify-center text-center">
                {/* Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-3xl h-[400px] bg-gradient-to-tr from-blue-600/30 to-violet-600/30 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8 select-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Next-Gen Campus Experience
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
                    Manage your college events with <span className="text-gradient inline-block">ultimate control.</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The all-in-one platform for creating, managing, and experiencing campus events. Seamless registration, automated attendance, and instant certificates.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {!user ? (
                        <>
                            <Link to="/register" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95">
                                Get Started
                            </Link>
                            <Link to="/events" className="px-8 py-4 rounded-xl glass-panel text-white font-semibold hover:bg-white/10 transition-all">
                                Browse Events
                            </Link>
                        </>
                    ) : (
                        <Link to="/events" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95">
                            Explore Events
                        </Link>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="mt-12 px-6">
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Card 1 */}
                    <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">QR Attendance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Seamlessly check-in students at events using highly reliable QR code scanning directly from any device.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Role-based Access</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Dedicated interfaces for Administrators, Organizers, and Students providing only the exact tools they need.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Automated Certificates</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Instantly generate and issue PDF certificates of completion to attendees as soon as the event concludes.</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Dashboard;