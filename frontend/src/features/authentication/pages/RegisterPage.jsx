import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import api from '../../../lib/axios';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setEmailError('');

        const passwordsMismatch = password !== passwordConfirmation;

        setLoading(true);

        try {
            await api.get('/sanctum/csrf-cookie');

            const response = await api.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            navigate('/verify-email', {
                state: {
                    email,
                    message: response.data.message,
                },
            });
        } catch (err) {
            const status = err.response?.status;
            const validationErrors = err.response?.data?.errors ?? {};

            if (status === 422) {
                if (validationErrors.email?.length > 0) {
                    setEmailError('This email address is already registered.');
                }

                if (passwordsMismatch) {
                    setError('Passwords do not match.');
                } else if (validationErrors.password?.length > 0) {
                    setError(validationErrors.password[0]);
                } else if (!validationErrors.email) {
                    const firstError = Object.values(validationErrors).flat()[0];
                    setError(firstError || 'Registration failed. Please try again.');
                }
            } else {
                setError(
                    err.response?.data?.message ||
                        'Registration failed. Please try again.',
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Register"
            subtitle="Get started with HelpDeskAI"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Full name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

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
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setEmailError('');
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    {emailError && (
                        <p role="alert" className="mt-1.5 text-sm text-red-600">
                            {emailError}
                        </p>
                    )}
                </div>

                <PasswordInput
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                />

                <div>
                    <PasswordInput
                        id="password_confirmation"
                        label="Confirm password"
                        value={passwordConfirmation}
                        onChange={(event) => setPasswordConfirmation(event.target.value)}
                        autoComplete="new-password"
                    />
                    {error && (
                        <p role="alert" className="mt-1.5 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
