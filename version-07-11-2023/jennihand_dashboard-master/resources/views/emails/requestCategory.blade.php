@component('mail::message')
# Request new category 

{{$name}} request a new category with the name of {{$category_name}}


Thanks,<br>
{{ config('app.name') }}
@endcomponent
