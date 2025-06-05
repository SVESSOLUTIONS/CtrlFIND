@extends('voyager::master')

{{--@section('page_title', $dataType->getTranslatedAttribute('display_name_plural') . ' ' . __('voyager::bread.order'))--}}

@section('page_header')
    <h1 class="page-title">
        <i class="voyager-list"></i>Faq
    </h1>
@stop

@section('javascript')

    <script>
        $(document).ready(function () {
            var maxField = 10; //Input fields increment limitation
            var addButton = $('.add_button'); //Add button selector
            var wrapper = $('.main_wrapper'); //Input field wrapper
            var fieldHTML = '<div class="field_wrapper"><a href="javascript:void(0);" class="remove_button btn btn-danger js-add--exam-row">remove</a><div class="form-group col-md-12 "><br><label class="control-label" for="name">Title</label> <input required="" type="text" class="form-control" name="title[]" placeholder="Title" value=""> </div><div class="form-group col-md-12"> <label class="control-label" for="name">Description</label> <textarea class="form-control" name="description[]" rows="5"></textarea></div> </div>';
            var x = 1; //Initial field counter is 1

            //Once add button is clicked
            $(addButton).click(function () {
                //Check maximum number of input fields
                if (x < maxField) {
                    x++; //Increment field counter
                    $(wrapper).append(fieldHTML); //Add field html
                }
            });

            //Once remove button is clicked
            $(wrapper).on('click', '.remove_button', function (e) {
                e.preventDefault();
                $(this).parent('div').remove(); //Remove field html
                x--; //Decrement field counter
            });
        });
    </script>
@stop
