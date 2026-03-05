import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register({ name, email, password, role });
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 -z-10 translate-x-1/2 translate-y-1/2"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join the smart college ecosystem.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                className={`py-2 rounded-lg border text-sm transition-all flex justify-center items-center gap-2 ${role === 'student' ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
                onClick={() => setRole('student')}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                className={`py-2 rounded-lg border text-sm transition-all flex justify-center items-center gap-2 ${role === 'organizer' ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
                onClick={() => setRole('organizer')}
              >
                📅 Organizer
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;