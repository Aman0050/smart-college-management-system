import { Link } from 'react-router-dom';

function EventCard({ event, actionButton }) {
    // Format date
    const dateObj = new Date(event.date);
    const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Check if event is upcoming, today, or past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(event.date);
    eventDay.setHours(0, 0, 0, 0);
    
    const isToday = today.getTime() === eventDay.getTime();
    const isPast = eventDay.getTime() < today.getTime();
    
    const timeRemainingStr = () => {
        if (isToday) return 'Starting Today';
        if (isPast) return 'Past Course';
        const diffTime = Math.abs(eventDay - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    };

    return (
        <div className="glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
            {/* Colored Top Bar based on status */}
            <div className={`h-1.5 w-full ${isPast ? 'bg-slate-500' : isToday ? 'bg-amber-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}></div>
            
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                        isPast ? 'bg-slate-500/10 border-slate-500/30 text-slate-400' : 
                        isToday ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' : 
                        'bg-pink-500/10 border-pink-500/30 text-pink-400'
                    }`}>
                        {timeRemainingStr()}
                    </div>
                    {event.registrationsCount !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                            <span>👥</span> {event.registrationsCount}
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {event.title}
                </h2>
                
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                    {event.description}
                </p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-2 rounded-xl">
                        <span className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">📅</span>
                        <div className="flex flex-col">
                            <span>{dateString}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-2 rounded-xl">
                        <span className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shadow-[inset_0_0_10px_rgba(20,184,166,0.2)]">📍</span>
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                {/* Organizer Info */}
                <div className="flex items-center gap-2 mb-6 border-t border-white/10 pt-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {event.organizer?.name ? event.organizer.name.substring(0, 2).toUpperCase() : 'TR'}
                    </div>
                    <span className="text-xs text-slate-400 truncate text-left">
                        By Prof. {event.organizer?.name || 'Unknown Teacher'}
                    </span>
                </div>

                {/* Action Area */}
                <div className="mt-auto pt-2">
                    {actionButton ? (
                        actionButton
                    ) : (
                        <Link
                            to={`/courses/${event._id}`}
                            className="block w-full text-center py-2.5 rounded-xl border border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-medium transition-colors"
                        >
                            Course Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventCard;
