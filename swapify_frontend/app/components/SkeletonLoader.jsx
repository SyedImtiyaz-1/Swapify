"use client";

const SkeletonLoader = () => (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 bg-white dark:bg-gray-900 p-3 sm:p-6 max-w-screen-xl mx-auto pb-20 md:pb-4">
        {[...Array(8)].map((_, i) => (
            <div 
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                role="status"
                aria-label="Loading listing..."
            >
                <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-2 sm:p-4 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
            </div>
        ))}
    </section>
);

export default SkeletonLoader; 