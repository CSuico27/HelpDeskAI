import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md">
                <Link to="/login" className="mb-8 flex items-center justify-center gap-3">
                    <Layers className="h-6 w-6 text-indigo-600" />
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        HelpDesk<span className="text-indigo-600">AI</span>
                    </span>
                </Link>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                    </div>

                    {children}
                </section>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} HelpDeskAI. All rights reserved.
                </p>
            </div>
        </main>
    );
}
