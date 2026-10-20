import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OTPInput } from 'input-otp';
import AuthLayout from '../components/AuthLayout';
import api from '../../../lib/axios';

export default function VerifyEmailPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    // const [message, setMessage] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(location.state?.email ? 60 : 0);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setTimeout(() => setCooldown((current) => current - 1), 1000);

        return () => clearTimeout(timer);
    }, [cooldown]);

    async function handleVerify(event) {
        event.preventDefault();
        setError('');
        // setMessage('');

        if (!email.trim() || code.length !== 6) {
            setError('Enter your email and six-digit verification code.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/api/email/verify', {
                email: email.trim(),
                code,
            });

            navigate('/login', {
                state: { message: response.data.message },
            });
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            setError(
                firstError ||
                error.response?.data?.message ||
                'Unable to verify your email. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        if (cooldown > 0) return;

        setError('');
        // setMessage('');

        if (!email.trim()) {
            setError('Enter the email address you registered with.');
            return;
        }

        setResending(true);

        try {
            await api.post('/api/email/resend', {
                email: email.trim(),
            });

            // setMessage(response.data.message);
            setCode('');
            setCooldown(60);
        } catch (error) {
            if (error.response?.status === 429) {
                // Too soon: sync the timer with the server instead of showing an error
                setCooldown(error.response.data?.retry_after ?? 60);
            } else {
                setError(
                    error.response?.data?.message ||
                    'Unable to resend the code. Please try again later.',
                );
            }
        } finally {
            setResending(false);
        }
    }

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Enter the six-digit code sent to your email."
        >
            <form onSubmit={handleVerify} className="space-y-5">
                {/* <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div> */}

                <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700">
                        Verification code
                    </label>

                    <OTPInput
                        maxLength={6}
                        value={code}
                        onChange={setCode}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        containerClassName="flex items-center justify-between gap-2"
                        render={({ slots }) => (
                            <>
                                <style>{`
                                    @keyframes otp-caret-blink {
                                        0%, 70%, 100% { opacity: 1; }
                                        20%, 50% { opacity: 0; }
                                    }
                                `}</style>

                                {slots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className={`relative flex h-12 w-10 items-center justify-center rounded-lg border text-lg font-semibold text-slate-800 transition sm:h-14 sm:w-12 ${
                                            slot.isActive
                                                ? 'border-indigo-500 ring-2 ring-indigo-100'
                                                : 'border-slate-300'
                                        }`}
                                    >
                                        {slot.char ?? ''}
                                        {slot.hasFakeCaret && (
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                <div
                                                    className="h-6 w-px bg-slate-800"
                                                    style={{ animation: 'otp-caret-blink 1.2s ease-out infinite' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* {message && (
                    <p role="status" className="text-sm text-emerald-700">
                        {message}
                    </p>
                )} */}

                <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Verifying...' : 'Verify email'}
                </button>
            </form>

            <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="mt-4 w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
                {resending
                    ? 'Sending...'
                    : cooldown > 0
                        ? `Resend code in ${cooldown}s`
                        : 'Resend verification code'}
            </button>

            {/* <p className="mt-6 text-center text-sm text-slate-600">
                Already verified?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Sign in
                </Link>
            </p> */}
        </AuthLayout>
    );
}
