@component('mail::message')
# Hello {{$user->name}}

{{$code}} is your verification code.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
