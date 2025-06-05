@extends('vendor.voyager.bread.browse')
@section('page_header')
    <div class="container-fluid">
        <h1 class="page-title">
            <i class="{{ $dataType->icon }}"></i> Commission Report
        </h1>
        @foreach($actions as $action)
            @if (method_exists($action, 'massAction'))
                @include('voyager::bread.partials.actions', ['action' => $action, 'data' => null])
            @endif
        @endforeach
        @include('voyager::multilingual.language-selector')
    </div>
@stop
@section('content')
    <div class="page-content browse container-fluid">
        @include('voyager::alerts')
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-bordered">
                    <div class="panel-body">
                        @if ($isServerSide)
                            <form method="get" class="form-search">
                                <div class="row">
                                    <div class="col-md-12">

                                        <div class="row col-md-2">
                                            <label>Provider</label>
                                            <select class="form-control" name="provider_name">
                                                <option value="">Select Provider Name</option>
                                                @foreach($providernames as $providername)
                                                    <option {{ request()->get('provider_name')==$providername?'Selected':''}} value="{{$providername}}">{{$providername}}</option>
                                                @endforeach
                                            </select>
                                            <div class="col-md-2">
                                                <input type="submit" class="btn btn-primary" value="Search" class="form-control">
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <form class="form-inline" action="{{url('admin/commission-report') }}" method="get">
                                                <div class="form-group">
                                                    <label>From</label>
                                                    <input type="date" name="start_date" class="form-control">
                                                </div>
                                                <div class="form-group">
                                                    <label>To</label>
                                                    <input type="date" name="end_date" class="form-control">
                                                </div>
                                                <button type="submit" class="btn btn-primary form-control">Submit</button>    
                                            </form>
                                        </div>

                                    </div>
                                    
                                </div>
                                @if (Request::has('sort_order') && Request::has('order_by'))
                                    <input type="hidden" name="sort_order" value="{{ Request::get('sort_order') }}">
                                    <input type="hidden" name="order_by" value="{{ Request::get('order_by') }}">
                                @endif
                            </form>
                        @endif
                        
                        <div class="table-responsive">
                            <table id="dataTable" class="table table-hover">
                                <thead>
                                <tr>
                         
                                    <th>Provider Name</th>
                                    <th >Commission</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($dataTypeContent as $data)
                                    <tr>
                
                                        <td>{{$data->provider_name}}</td>
                                        <td>{{$data->commission}}</td>

                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                        @if ($isServerSide)
                            <div class="pull-left">
                                <div role="status" class="show-res" aria-live="polite">{{ trans_choice(
                                    'voyager::generic.showing_entries', $dataTypeContent->total(), [
                                        'from' => $dataTypeContent->firstItem(),
                                        'to' => $dataTypeContent->lastItem(),
                                        'all' => $dataTypeContent->total()
                                    ]) }}</div>
                            </div>
                            <div class="pull-right">
                                {{ $dataTypeContent->appends([
                                    's' => $search->value,
                                    'filter' => $search->filter,
                                    'key' => $search->key,
                                    'order_by' => $orderBy,
                                    'sort_order' => $sortOrder,
                                    'showSoftDeleted' => $showSoftDeleted,
                                ])->links() }}
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Single delete modal --}}
    <div class="modal modal-danger fade" tabindex="-1" id="delete_modal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="{{ __('voyager::generic.close') }}"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title"><i class="voyager-trash"></i> {{ __('voyager::generic.delete_question') }} {{ strtolower($dataType->getTranslatedAttribute('display_name_singular')) }}?</h4>
                </div>
                <div class="modal-footer">
                    <form action="#" id="delete_form" method="POST">
                        {{ method_field('DELETE') }}
                        {{ csrf_field() }}
                        <input type="submit" class="btn btn-danger pull-right delete-confirm" value="{{ __('voyager::generic.delete_confirm') }}">
                    </form>
                    <button type="button" class="btn btn-default pull-right" data-dismiss="modal">{{ __('voyager::generic.cancel') }}</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
@stop
