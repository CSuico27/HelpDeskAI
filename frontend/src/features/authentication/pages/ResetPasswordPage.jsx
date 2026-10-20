
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import api from '../../../lib/axios';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await api.post('/reset-password', {
                token: searchParams.get('token'),
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setMessage(response.data.message);

            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(' ')
                    : err.response?.data?.message ||
                    'Unable to reset your password. Please try again.'
            );
        }
    }

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Choose a new password for your account."
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
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <PasswordInput
                    id="password"
                    label="New password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                />

                <PasswordInput
                    id="password_confirmation"
                    label="Confirm new password"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    autoComplete="new-password"
                />

                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                {message && (
                    <p role="status" className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Reset password
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Return to{' '}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
