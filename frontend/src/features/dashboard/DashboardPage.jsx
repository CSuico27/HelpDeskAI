import { useDashboardData } from './hooks/useDashboardData';

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Page heading */}
            <div>
                <div className="h-7 w-40 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
            </div>

            {/* Statistics cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                        <div className="h-4 w-24 rounded bg-slate-200" />
                        <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-32 rounded bg-slate-100" />
                    </div>
                ))}
            </div>

            {/* Chart and status sections */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="h-72 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                    <div className="h-5 w-36 rounded bg-slate-200" />
                    <div className="mt-6 h-48 rounded-lg bg-slate-100" />
                </div>

                <div className="h-72 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="h-5 w-32 rounded bg-slate-200" />
                    <div className="mt-6 space-y-5">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index}>
                                <div className="h-3 w-full rounded bg-slate-100" />
                                <div className="mt-2 h-2 w-2/3 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent tickets section */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="h-5 w-36 rounded bg-slate-200" />
                <div className="mt-5 space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 rounded-lg bg-slate-100"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data, loading, error } = useDashboardData();

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h2 className="font-semibold text-red-700">
                    Unable to load dashboard
                </h2>
                <p className="mt-1 text-sm text-red-600">
                    Please try refreshing the page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Welcome to your HelpDeskAI dashboard.
                </p>
            </div>

            {/* Add your statistics cards, charts, and tickets here. */}
        </div>
    );
}