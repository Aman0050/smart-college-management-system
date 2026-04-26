import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="mt-auto border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-sm">
                                🎓
                            </span>
                            Smart<span className="text-gradient">College</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            The all-in-one platform for creating, managing, and experiencing campus events. Built for modern colleges.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/events" className="text-slate-400 hover:text-white transition-colors">Browse Events</Link></li>
                            <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Create Account</Link></li>
                            <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Info</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-slate-400">QR Attendance System</span></li>
                            <li><span className="text-slate-400">Automated Certificates</span></li>
                            <li><span className="text-slate-400">Role-based Access</span></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} SmartCollege. All rights reserved.</p>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <span>Built with</span>
                        <span className="text-pink-400">♥</span>
                        <span>for modern campuses</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
