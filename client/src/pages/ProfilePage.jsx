

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';

function ProfilePage() {
    const { user, logout } = useAuth();
    const toast = useToast();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [saving, setSaving] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/users/profile', { name, email });
            // Update localStorage
            const stored = JSON.parse(localStorage.getItem('user'));
            stored.name = res.data.name;
            stored.email = res.data.email;
            localStorage.setItem('user', JSON.stringify(stored));
            toast.success('Profile updated successfully!');
            setEditing(false);
            // Would need to reload to reflect in context — simplified
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const roleColors = {
        admin: 'from-rose-500 to-fuchsia-500',
        organizer: 'from-pink-500 to-fuchsia-500',
        student: 'from-pink-500 to-rose-500',
    };

    const roleBadgeColors = {
        admin: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        organizer: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        student: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };

    return (
        <div className="animate-fade-in pb-12 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            <div className="glass-panel rounded-2xl overflow-hidden relative">
                {/* Banner */}
                <div className={`h-32 bg-gradient-to-r ${roleColors[user.role] || roleColors.student} relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Avatar */}
                <div className="relative px-8">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-[var(--bg-dark)] flex items-center justify-center text-3xl text-white font-bold uppercase -mt-12 relative z-10 shadow-xl">
                        {user.name?.substring(0, 2)}
                    </div>
                </div>

                {/* Info */}
                <div className="p-8 pt-4">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleBadgeColors[user.role]}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                            <p className="text-sm text-slate-200 font-mono truncate">{user._id}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Role</p>
                            <p className="text-sm text-slate-200 capitalize">{user.role}</p>
                        </div>
                    </div>

                    {/* Edit Form */}
                    {editing ? (
                        <form onSubmit={handleSave} className="space-y-4 border-t border-white/10 pt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setEditing(false); setName(user.name); setEmail(user.email); }}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-500/25 text-sm disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="border-t border-white/10 pt-6 flex gap-3">
                            <button
                                onClick={() => setEditing(true)}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors text-sm"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={logout}
                                className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl font-medium transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
