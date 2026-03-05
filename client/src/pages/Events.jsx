import { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                setError('Failed to load events. Ensure you are logged in if this is restricted.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-10 text-center max-w-2xl mx-auto pt-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Upcoming <span className="text-gradient">Events</span>
                </h1>
                <p className="text-slate-400">
                    Discover and register for the latest symposiums, tech events, and fests happening on campus.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="glass-panel p-8 text-center text-red-400 max-w-lg mx-auto rounded-2xl border-red-500/30">
                    {error}
                </div>
            ) : events.length === 0 ? (
                <div className="glass-panel p-16 text-center max-w-2xl mx-auto rounded-2xl flex flex-col items-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                    <p className="text-slate-400">There are currently no approved events to show. Check back later!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Events;