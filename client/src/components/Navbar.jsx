import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `transition-colors font-medium ${isActive(path) ? 'text-white' : 'text-slate-400 hover:text-white'}`;

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'organizer') return '/teacher';
    return '/student';
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 md:px-6 py-3 md:py-4 mx-2 md:mx-4 mt-2 md:mt-4 rounded-xl md:rounded-2xl border-white/10 shadow-2xl animate-fade-in backdrop-blur-2xl">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-sm">
            🎓
          </span>
          Smart<span className="text-gradient">College</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link to={getDashboardLink()} className={linkClass(getDashboardLink())}>
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={linkClass('/admin')}>Admin Panel</Link>
              )}
              {user.role === 'organizer' && (
                <Link to="/teacher" className={linkClass('/teacher')}>Teacher Panel</Link>
              )}
              <Link to="/courses" className={linkClass('/courses')}>Courses</Link>

              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10 relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 border border-white/20 flex items-center justify-center text-xs text-white uppercase font-bold">
                    {user.name ? user.name.substring(0, 2) : 'U'}
                  </div>
                  <span className="text-slate-200 hidden lg:block">{user.name}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' :
                        user.role === 'organizer' ? 'bg-pink-500/20 text-pink-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>{user.role === 'organizer' ? 'Teacher' : user.role}</span>
                      {user.role === 'organizer' && !user.isApproved && (
                        <span className="inline-block ml-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300">Pending</span>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        📊 Dashboard
                      </Link>
                    </div>
                    <div className="border-t border-white/10 py-1">
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="space-y-1.5 w-6 flex flex-col items-end">
              <div className="h-0.5 w-full bg-white rounded-full"></div>
              <div className="h-0.5 w-4/5 bg-white rounded-full"></div>
              <div className="h-0.5 w-full bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2 animate-fade-in">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2 py-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 border border-white/20 flex items-center justify-center text-sm text-white uppercase font-bold">
                  {user.name?.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm">📊 Dashboard</Link>
              <Link to="/courses" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm">📅 Courses</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm">👤 Profile</Link>
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-sm"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">🔑 Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-sm text-center font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-transform mt-4">
                Join Smart College
              </Link>
            </>
          )}
        </div>
      )}

      {/* Click outside to close profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
      )}
    </nav>
  );
}

export default Navbar;