
import { useState } from 'react';

export default function PasswordInput({
    id = 'password',
    label = 'Password',
    value,
    onChange,
    autoComplete = 'current-password',
    required = true,
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
        </div>
    );
}
