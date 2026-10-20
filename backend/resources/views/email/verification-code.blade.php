<x-mail::message>
Hello {{ $user->name }},

Thank you for registering with HelpdeskAI. Use the code below to verify your email address.

<x-mail::panel>
## {{ $code }}
</x-mail::panel>

This code expires in 10 minutes.

If you did not create a HelpdeskAI account, you can ignore this email.

Regards,<br>
{{ config('app.name') }}
</x-mail::message>