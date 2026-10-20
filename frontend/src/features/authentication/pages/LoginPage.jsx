import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import api from '../../../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            // Initialize Laravel's CSRF cookie.
            await api.get('/sanctum/csrf-cookie');

            // Log in using Laravel's session cookie.
            const response = await api.post('/api/login', {
                email,
                password,
                remember: rememberMe,
            });

            setUser(response.data.user);
            navigate('/', { replace: true });
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;

                setError(
                    errors?.email?.[0] ||
                    errors?.password?.[0] ||
                    err.response.data.message ||
                    'Please check your login details.',
                );
            } else if (err.response?.status === 403) {
                setError(
                    err.response.data.message ||
                    'Please verify your email before signing in.',
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    'Unable to sign in. Please try again.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Login"
            subtitle="Sign in to your HelpDeskAI account"
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

                <div>
                    <PasswordInput
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <div className="mb-1.5 flex items-center justify-end gap-3">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                    />
                    Remember me
                </label>

                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
}