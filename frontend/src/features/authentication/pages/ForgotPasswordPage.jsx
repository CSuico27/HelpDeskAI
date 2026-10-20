
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        // We'll connect this form to Laravel later.
        setMessage(
            'If an account exists for this email, you will receive password-reset instructions.',
        );
    }

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email and we'll help you reset your password."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                {message && (
                    <p role="status" className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Send reset instructions
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Remember your password?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Back to sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
