import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '../components/EventCard';

function OrganizerDashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user || user.role !== 'organizer') {
        return <Navigate to="/" replace />;
    }

    const fetchMyEvents = async () => {
        try {
            const res = await api.get('/events');
            // Organizers get all events back by default in our current setup or their own? 
            // Current backend config: if organizer requests GET /api/events, it returns all events for now (need to filter client side or fix backend if it was supposed to filter).
            // Assuming GET /api/events returns all, let's filter by matching organizer ID.
            const myEvents = res.data.filter(ev => ev.organizer?._id === user._id || ev.organizer === user._id);
            setEvents(myEvents);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    return (
        <div className="animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Organizer Dashboard</h1>
                    <p className="text-slate-400">Manage your created events and track attendance.</p>
                </div>
                <Link
                    to="/organizer/create-event"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Create New Event
                </Link>
            </div>

            <h2 className="text-xl font-semibold text-white mb-6">My Events</h2>

            {loading ? (
                <div className="flex justify-center items-center h-32 text-slate-400">Loading your events...</div>
            ) : events.length === 0 ? (
                <div className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl border border-white/5">📋</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Events Created Yet</h3>
                    <p className="text-slate-400 max-w-sm mb-6">You haven't created any events. Start organizing to see them appear here.</p>
                    <Link to="/organizer/create-event" className="px-6 py-2 glass-panel text-blue-400 hover:text-blue-300 font-medium rounded-lg">Create One Now</Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            actionButton={
                                <Link
                                    to={`/events/${event._id}/manage`}
                                    className="block w-full text-center py-2.5 rounded-xl border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium transition-colors"
                                >
                                    Manage & Scan QR
                                </Link>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrganizerDashboard;
