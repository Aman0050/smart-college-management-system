import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 mx-4 mt-4 rounded-2xl animate-fade-in flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm">
          🎓
        </span>
        Smart<span className="text-gradient">College</span>
      </Link>

      <div className="flex items-center gap-6 font-medium text-sm">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">Admin Dashboard</Link>
            )}
            {user.role === 'organizer' && (
              <Link to="/organizer" className="text-slate-300 hover:text-white transition-colors">Organizer Panel</Link>
            )}
            <Link to="/events" className="text-slate-300 hover:text-white transition-colors">Events</Link>

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs text-slate-300 uppercase">
                  {user.name ? user.name.substring(0, 2) : 'U'}
                </div>
                <span className="text-slate-200 hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;