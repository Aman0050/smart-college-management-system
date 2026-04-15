import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();

    // Redirect logged-in users to their dashboard
    if (user && user.role === 'student') return <Navigate to="/student" replace />;
    if (user && user.role === 'organizer') return <Navigate to="/teacher" replace />;
    if (user && user.role === 'admin') return <Navigate to="/admin" replace />;

    return (
        <div className="animate-fade-in pb-20">

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:px-8 flex flex-col items-center justify-center text-center">
                {/* Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 max-w-3xl h-[300px] sm:h-[400px] bg-gradient-to-tr from-pink-600/20 to-amber-500/15 blur-[80px] sm:blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 select-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                    Next-Gen Campus Experience
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.1] mb-6 max-w-4xl mx-auto">
                    Manage your university <span className="text-pink-500">courses</span> with <span className="text-gradient inline-block">ultimate control.</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                    The all-in-one platform for creating, managing, and experiencing academic courses. Seamless enrollment, automated attendance, and instant certifications.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
                    <Link to="/register" className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-95 text-center">
                        Get Started Free
                    </Link>
                    <Link to="/courses" className="px-8 py-4 rounded-xl glass-panel text-white font-bold hover:bg-white/10 transition-all text-center">
                        Browse Courses
                    </Link>
                </div>
            </section>

            {/* How It Works */}
            <section className="mt-8 px-4 sm:px-6">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">How It Works</h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">From registration to certification — in four simple steps.</p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { step: '01', title: 'Create Account', desc: 'Sign up as a Student or Teacher in seconds.', icon: '🎓', color: 'emerald' },
                        { step: '02', title: 'Find & Enroll', desc: 'Find courses and enroll with a single click.', icon: '📚', color: 'teal' },
                        { step: '03', title: 'Attend & Scan', desc: 'Scan the secure QR code in class for instant check-in.', icon: '📱', color: 'amber' },
                        { step: '04', title: 'Get Certified', desc: 'Download your PDF certificate automatically.', icon: '📜', color: 'orange' },
                    ].map((item, i) => (
                        <div key={i} className="relative glass-panel p-6 sm:p-8 rounded-2xl hover:bg-white/5 transition-all group text-center hover:translate-y-[-4px]">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">{item.step}</div>
                            <div className="text-4xl sm:text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            {i < 3 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 text-slate-700 text-xl font-light">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="mt-20 sm:mt-32 px-4 sm:px-6">
                <div className="text-center mb-10 sm:mb-12">
                    <div className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-2">Capabilities</div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">Powerful Features</h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">Everything you need to run a modern campus academic platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl hover:bg-white/5 transition-all group border-l-4 border-pink-500/0 hover:border-pink-500/50">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20 group-hover:bg-pink-500/20 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">QR Attendance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Seamlessly check-in students at lectures using rotating QR code scanning. Fast, secure, and verification-ready.</p>
                    </div>

                    <div className="glass-panel p-6 sm:p-8 rounded-2xl hover:bg-white/5 transition-all group border-l-4 border-amber-500/0 hover:border-amber-500/50">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Professional Portals</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Dedicated interfaces for Administrators, Teachers, and Students with professional approval workflows.</p>
                    </div>

                    <div className="glass-panel p-6 sm:p-8 rounded-2xl hover:bg-white/5 transition-all group border-l-4 border-rose-500/0 hover:border-rose-500/50">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 mb-6 border border-rose-500/20 group-hover:bg-rose-500/20 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Automated Certificates</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Instantly generate and issue PDF certificates to attendees once they are checked in. High-quality and verifiable.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="mt-20 sm:mt-32 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-pink-600/5 to-transparent pointer-events-none"></div>
                    <div className="relative">
                        <div className="text-4xl sm:text-6xl mb-8">“</div>
                        <blockquote className="text-lg sm:text-2xl text-white font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                            SmartCollege transformed how we manage campus academic sessions. The secure QR attendance system alone saved us hours of manual entry.
                        </blockquote>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-lg text-white font-bold shadow-lg shadow-pink-500/20">
                                AS
                            </div>
                            <div className="text-center">
                                <p className="text-base font-bold text-white">Prof. Ananya Sharma</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Head of Faculty, Computer Science</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-20 sm:mt-32 px-4 sm:px-6 text-center max-w-3xl mx-auto pb-20">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">Ready to transform your campus?</h2>
                <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed px-4">Join hundreds of students and faculty members already using the next generation of academic management.</p>
                <Link to="/register" className="inline-block w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-2xl shadow-pink-500/30 transition-all hover:scale-[1.05] active:scale-95">
                    Create Free Account
                </Link>
            </section>
        </div>
    );
}

export default Dashboard;