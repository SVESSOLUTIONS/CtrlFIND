@extends('voyager::master')

{{--@section('page_title', $dataType->getTranslatedAttribute('display_name_plural') . ' ' . __('voyager::bread.order'))--}}

@section('page_header')
    <h1 class="page-title">
        <i class="voyager-list"></i>Faq
    </h1>
@stop
@section('content')
    <div class="page-content edit-add container-fluid">
        <div class="row">
            <div class="col-md-12">
                @if($faq->body)
                <div class="panel panel-bordered">
                    <!-- form start -->
                        <form action="{{route('faqs.update',$faq->id)}}" method="POST">
                            <input type="hidden" name="_method" value="PUT">
                        <!-- CSRF TOKEN -->
                        <input type="hidden" name="_token" value="{{csrf_token()}}">
                        <div class="panel-body">
                            <!-- GET THE DISPLAY OPTIONS -->
                            <div class="main_wrapper">
                            @foreach($faq->body as $k=>$single)
                            <div class="field_wrapper">
                                @if($loop->first)
                                @else
                                    <a href="javascript:void(0);" class="remove_button btn btn-danger js-add--exam-row">remove</a><br>
                                @endif
                            <div class="form-group  col-md-12 ">
                                <label class="control-label" for="name">Title</label>
                                <input required="" type="text" class="form-control" name="title[]" placeholder="Title" value="{{$single->title}}">
                            </div>
                            <div class="form-group col-md-12">
                                <label class="control-label" for="name">Description</label>
                                <textarea class="form-control" name="description[]" rows="5">{{$single->description}}</textarea>
                            </div>
                            </div>
                            @endforeach

                            </div>
                            <div class="col-md-12">
                                <a href="javascript:void(0);" class="add_button btn btn-primary js-add--exam-row" title="Add field">Add more</a>
                            </div>
                        </div><!-- panel-body -->

                        <div class="panel-footer">
                            <button type="submit" class="btn btn-primary save">Save</button>
                        </div>
                    </form>

                </div>
                    @endif
            </div>
        </div>
    </div>

@stop
@section('javascript')

    <script>
        $(document).ready(function () {
                var maxField = 10; //Input fields increment limitation
                var addButton = $('.add_button'); //Add button selector
                var wrapper = $('.main_wrapper'); //Input field wrapper
                var fieldHTML = '<div class="field_wrapper"><a href="javascript:void(0);" class="remove_button btn btn-danger js-add--exam-row">remove</a><br><div class="form-group col-md-12"><label class="control-label" for="name">Title</label> <input required="" type="text" class="form-control" name="title[]" placeholder="Title" value=""> </div><div class="form-group col-md-12"> <label class="control-label" for="name">Description</label> <textarea class="form-control" name="description[]" rows="5"></textarea> </div></div>';
                var x = 1; //Initial field counter is 1
                //Once add button is clicked
                $(addButton).click(function()
                {
                    //Check maximum number of input fields
                    if(x < maxField){
                        x++; //Increment field counter
                        $(wrapper).append(fieldHTML); //Add field html
                    }
                });
                //Once remove button is clicked
                $(wrapper).on('click', '.remove_button', function(e){
                    e.preventDefault();
                    $(this).parent('div').remove(); //Remove field html
                    x--; //Decrement field counter
                });
            });
    </script>
@stop
