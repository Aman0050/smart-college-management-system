import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

function Courses() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to load courses:', err);
                setError(
                    err.response?.status === 401
                        ? 'Session expired. Please log in again.'
                        : `Failed to load courses. ${err.message || 'Check your connection.'}`
                );
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchEvents();
        }
    }, [authLoading]);

    const now = new Date();

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase());

        if (filter === 'upcoming') return matchesSearch && new Date(event.date) >= now;
        if (filter === 'past') return matchesSearch && new Date(event.date) < now;
        return matchesSearch;
    });

    if (authLoading) {
        return (
            <div className="pt-20">
                <LoadingSkeleton type="card" count={3} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-6">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full"></div>
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.3)] border border-white/10">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Academic Access Required</h1>
                <p className="text-slate-400 text-center max-w-md mb-10 leading-relaxed font-medium">
                    To maintain the privacy and security of our college courses and events, browsing is restricted to <span className="text-pink-400">verified students and teachers</span> only.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Link to="/login" className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10">
                        Login Now
                    </Link>
                    <Link to="/register" className="flex-1 py-4 bg-pink-600/10 border border-pink-500/20 text-pink-400 rounded-2xl font-bold text-center hover:bg-pink-600/20 transition-all">
                        Create Account
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-10 text-center max-w-2xl mx-auto pt-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Course <span className="text-gradient">Catalog</span>
                </h1>
                <p className="text-slate-400">
                    Discover and enroll in advanced courses, symposiums, and academy workshops.
                </p>
            </div>

            {/* Search & Filters */}
            <div className="max-w-3xl mx-auto mb-10">
                <div className="relative mb-4">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search courses by name, description, or classroom..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 bg-[#0F1520] text-white focus:border-pink-500 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {['all', 'upcoming', 'past'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                filter === f
                                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25'
                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <span className="ml-auto text-sm text-slate-500">
                        {filteredEvents.length} course{filteredEvents.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton type="card" count={6} />
            ) : error ? (
                <div className="glass-panel p-8 text-center text-red-400 max-w-lg mx-auto rounded-2xl border-red-500/30">
                    {error}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="glass-panel p-16 text-center max-w-2xl mx-auto rounded-2xl flex flex-col items-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {search ? 'No Matching Courses' : 'Catalog Empty'}
                    </h3>
                    <p className="text-slate-400">
                        {search
                            ? `No courses found matching "${search}". Try a different search term.`
                            : 'There are currently no approved courses to show. Check back later!'
                        }
                    </p>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;