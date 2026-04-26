function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = 'emerald' }) {
    if (!isOpen) return null;

    const colorMap = {
        emerald: 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/25',
        red: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25',
        teal: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>

            {/* Modal */}
            <div className="glass-panel relative rounded-2xl p-8 max-w-md w-full animate-fade-in border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg text-sm ${colorMap[confirmColor] || colorMap.emerald}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
