import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
    } else {
      toast.success('Successfully logged in!');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    const result = await googleLogin(credentialResponse.credential, role);
    
    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
    } else {
      toast.success('Successfully authenticated via Google!');
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    setError('Google Authentication Failed');
    toast.error('Google Authentication Failed');
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center bg-[#0B0F19] relative z-10 selection:bg-pink-500/30">
      
      {/* Background gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-50 -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-[400px] px-6 animate-fade-in flex flex-col items-center">
        
        {/* Logo / App Name */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(244,63,94,0.4)] relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <span className="text-3xl relative z-10">🎓</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Smart <span className="text-pink-500">College</span></h1>
          <p className="text-slate-400 font-medium tracking-wide">Enter your academic workspace.</p>
        </div>

        {/* Action Card */}
        <div className="w-full bg-[#151D2A]/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
          
          {/* Inner glowing element */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/10 rounded-br-full blur-2xl pointer-events-none z-0"></div>

          {/* Role Segmented Control */}
          <div className="w-full bg-[#0F1520] rounded-2xl p-1.5 flex mb-8 relative z-10">
            <button
               onClick={() => setRole('student')}
               type="button"
               className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${role === 'student' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
               Student
            </button>
            <button
               onClick={() => setRole('organizer')}
               type="button"
               className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${role === 'organizer' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
               Teacher
            </button>
            <button
               onClick={() => setRole('admin')}
               type="button"
               className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${role === 'admin' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
               Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10 text-slate-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-[#0F1520] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600"
                placeholder="aman@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0F1520] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(190,24,74,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#151D2A] px-4 text-slate-500 font-bold">Or enter with</span>
            </div>
          </div>

          <div className="flex flex-col items-center shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl bg-white overflow-hidden w-full relative z-10 transition-transform active:scale-[0.98]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>

        </div>

        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-pink-400 hover:text-pink-300 font-bold tracking-wide transition-colors">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;