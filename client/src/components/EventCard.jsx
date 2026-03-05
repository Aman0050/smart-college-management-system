import { Link } from 'react-router-dom';

function EventCard({ event, actionButton }) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="glass-panel rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 flex flex-col group">
            <div className="h-48 bg-slate-800 relative overflow-hidden">
                {/* Placeholder gradient for media until images are supported */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-violet-900/50 group-hover:scale-105 transition-transform duration-500"></div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-white shadow-lg">
                    {event.status === 'approved' ? (
                        <span className="text-emerald-400">● Approved</span>
                    ) : event.status === 'pending' ? (
                        <span className="text-amber-400">● Pending</span>
                    ) : (
                        <span className="text-rose-400">● Rejected</span>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">
                    {formattedDate} • {event.time}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {event.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">
                    {event.description}
                </p>

                <div className="flex items-center text-sm text-slate-300 mb-6 gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {event.location}
                </div>

                <div className="mt-auto">
                    {actionButton || (
                        <Link
                            to={`/events/${event._id}`}
                            className="block w-full text-center py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventCard;
