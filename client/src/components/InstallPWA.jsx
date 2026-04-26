import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = evt => {
    evt.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
  };

  if (!supportsPWA || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-slide-up">
      <div className="glass-panel p-4 rounded-3xl shadow-2xl shadow-pink-600/20 flex flex-col gap-3 relative border border-white/10 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 p-0.5 shadow-lg shadow-pink-500/30 flex-shrink-0 relative overflow-hidden">
               <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div className="flex-1">
                <h3 className="text-white font-bold text-[15px] leading-tight mb-0.5">Install Smart College App</h3>
                <p className="text-slate-400 text-xs">Add to home screen for the full premium experience.</p>
            </div>
            
            <button 
                onClick={() => setIsDismissed(true)} 
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <button
          onClick={onClick}
          className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Install Now
        </button>
      </div>
    </div>
  );
}
