import { useState, useEffect, useRef } from 'react';

function StatsCounter({ end, duration = 2000, label, icon, color = 'blue' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateCount();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);

    const animateCount = () => {
        const startTime = performance.now();
        const endValue = Number(end) || 0;

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * endValue));

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const colorMap = {
        blue: 'from-pink-400 to-fuchsia-400',
        violet: 'from-rose-400 to-fuchsia-400',
        emerald: 'from-pink-400 to-rose-400',
        amber: 'from-amber-400 to-orange-400',
        rose: 'from-rose-400 to-pink-400',
        indigo: 'from-pink-400 to-pink-400',
    };

    const iconBgMap = {
        blue: 'bg-pink-500/20 text-pink-400',
        violet: 'bg-rose-500/20 text-rose-400',
        emerald: 'bg-pink-500/20 text-pink-400',
        amber: 'bg-amber-500/20 text-amber-400',
        rose: 'bg-rose-500/20 text-rose-400',
        indigo: 'bg-pink-500/20 text-pink-400',
    };

    return (
        <div ref={ref} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors">
            {icon && (
                <div className={`w-12 h-12 rounded-xl ${iconBgMap[color] || iconBgMap.blue} flex items-center justify-center mb-3 border border-white/5 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            )}
            <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</div>
            <div className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${colorMap[color] || colorMap.blue}`}>
                {count.toLocaleString()}
            </div>
        </div>
    );
}

export default StatsCounter;
