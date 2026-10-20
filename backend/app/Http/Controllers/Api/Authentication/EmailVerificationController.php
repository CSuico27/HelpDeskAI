<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use App\Mail\VerificationCodeMail;
use Carbon\Carbon;

class EmailVerificationController extends Controller
{
    private function sendCode(User $user): void
    {
        $code = (string) random_int(100000, 999999);

        DB::table('email_verification_codes')->updateOrInsert(
            ['user_id' => $user->id],
            [
                'code_hash' => Hash::make($code),
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
                'last_sent_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Mail::raw(
        //     "Your Helpdesk AI verification code is {$code}.\n\n"
        //     . "This code expires in 10 minutes. If you did not request it, "
        //     . "you can ignore this email.",
        //     function ($message) use ($user) {
        //         $message->to($user->email)
        //             ->subject('Your Helpdesk AI verification code');
        //     }
        // );
        Mail::to($user->email)->send(new VerificationCodeMail($code, $user));
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'email_verified_at' => null,
        ]);

        try {
            $this->sendCode($user);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'We could not send the verification email. Please try again shortly.',
            ], 503);
        }

        return response()->json([
            'message' => 'Account created. Check your email for the verification code.',
            'email' => $user->email,
        ], 201);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'code' => ['The code is invalid or expired.'],
            ]);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Your email is already verified. You can sign in.',
            ]);
        }

        $verified = DB::transaction(function () use ($user, $validated) {
            $record = DB::table('email_verification_codes')
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (! $record || now()->greaterThanOrEqualTo($record->expires_at)
                || $record->attempts >= 5) {
                return false;
            }

            if (! Hash::check($validated['code'], $record->code_hash)) {
                DB::table('email_verification_codes')
                    ->where('user_id', $user->id)
                    ->increment('attempts');

                return false;
            }

            $user->forceFill([
                'email_verified_at' => now(),
            ])->save();

            $user->assignRole('user');

            DB::table('email_verification_codes')
                ->where('user_id', $user->id)
                ->delete();

            return true;
        });

        if (! $verified) {
            throw ValidationException::withMessages([
                'code' => ['The code is incorrect, expired, or has reached its attempt limit.'],
            ]);
        }

        return response()->json([
            'message' => 'Email verified successfully. You can now sign in.',
        ]);
    }

    public function resend(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || $user->email_verified_at) {
            return response()->json([
                'message' => 'If an unverified account exists, a new code can be sent.',
            ]);
        }

        $record = DB::table('email_verification_codes')
            ->where('user_id', $user->id)
            ->first();

        if ($record && $record->last_sent_at) {
            $elapsed = now()->diffInSeconds(Carbon::parse($record->last_sent_at), true);
            $wait = (int) ceil(60 - $elapsed);

            if ($wait > 0) {
                return response()->json([
                    'message' => "Please wait {$wait} seconds before requesting another code.",
                    'retry_after' => $wait,
                ], 429);
            }
        }

        try {
            $this->sendCode($user);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'We could not send the email. Please try again shortly.',
            ], 503);
        }

        return response()->json([
            'message' => 'If an unverified account exists, a new code can be sent.',
        ]);
    }
}
