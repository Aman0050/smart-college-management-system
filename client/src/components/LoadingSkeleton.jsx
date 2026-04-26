function LoadingSkeleton({ type = 'card', count = 3 }) {
    if (type === 'card') {
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="glass-panel rounded-2xl overflow-hidden">
                        <div className="h-48 skeleton-shimmer"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-4 w-24 skeleton-shimmer rounded-full"></div>
                            <div className="h-6 w-3/4 skeleton-shimmer rounded-lg"></div>
                            <div className="h-4 w-full skeleton-shimmer rounded-lg"></div>
                            <div className="h-4 w-2/3 skeleton-shimmer rounded-lg"></div>
                            <div className="h-10 w-full skeleton-shimmer rounded-xl mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="h-6 w-40 skeleton-shimmer rounded-lg"></div>
                </div>
                <div className="p-4 space-y-3">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3">
                            <div className="h-4 w-1/4 skeleton-shimmer rounded-lg"></div>
                            <div className="h-4 w-1/4 skeleton-shimmer rounded-lg"></div>
                            <div className="h-4 w-1/6 skeleton-shimmer rounded-lg"></div>
                            <div className="h-4 w-1/6 skeleton-shimmer rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'stats') {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl text-center">
                        <div className="h-4 w-20 mx-auto skeleton-shimmer rounded-full mb-3"></div>
                        <div className="h-12 w-16 mx-auto skeleton-shimmer rounded-xl"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'detail') {
        return (
            <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in max-w-4xl mx-auto">
                <div className="p-8 sm:p-12 border-b border-white/10">
                    <div className="h-6 w-24 skeleton-shimmer rounded-full mb-6"></div>
                    <div className="h-10 w-3/4 skeleton-shimmer rounded-xl mb-6"></div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="h-20 skeleton-shimmer rounded-xl"></div>
                        <div className="h-20 skeleton-shimmer rounded-xl"></div>
                    </div>
                </div>
                <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-12">
                    <div className="md:w-2/3 space-y-4">
                        <div className="h-6 w-40 skeleton-shimmer rounded-lg"></div>
                        <div className="h-4 w-full skeleton-shimmer rounded-lg"></div>
                        <div className="h-4 w-full skeleton-shimmer rounded-lg"></div>
                        <div className="h-4 w-3/4 skeleton-shimmer rounded-lg"></div>
                    </div>
                    <div className="md:w-1/3">
                        <div className="h-48 skeleton-shimmer rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default LoadingSkeleton;
