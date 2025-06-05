@extends('voyager::master')
@section('page_header')
    <h1 class="page-title"><i class="voyager-list"></i>Faq</h1>
    @if(!$data['count'])
    <a href="{{route('faqs.create')}}" class="btn btn-success btn-add-new"><i class="voyager-plus"></i>
        <span>Add New</span></a>
    @endif
    {!! menu('main','mymenu') !!}
@stop
@section('content')
    <div class="col-md-12">
        <div class="panel panel-bordered">
            <div class="panel-body">
                <div class="table-responsive">
                    <table
                        class=" dataTables_wrapper form-inline dt-bootstrap no-footer table table-striped table-bordered">
                        <thead>
                        <tr>
                            <td>ID</td>
                            <td>Slug</td>
                            <td>Created At</td>
                            <td>Actions</td>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($data['data'] as $key => $value)
                            <tr>
                                <td>{{ $value->id }}</td>
                                <td>{{ $value->slug }}</td>
                                <td>{{ date('d/m/y', strtotime($value->created_at))}}</td>

                                <!-- we will also add show, edit, and delete buttons -->
                                <td class="no-sort no-click bread-actions">
                                    <!-- <a href="javascript:;" title="Delete" class="btn btn-sm btn-danger pull-right delete" data-id="6" id="delete-6">
                                          <i class="voyager-trash"></i> <span class="hidden-xs hidden-sm">Delete</span>
                            </a> -->
                                    <a href="{{route('faqs.edit', $value->id)}}" title="Edit"
                                       class="btn btn-sm btn-primary pull-right edit">
                                        <i class="voyager-edit"></i> <span class="hidden-xs hidden-sm">Edit</span>
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>

                    <div id="dataTable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"></div>
                </div>
            </div>
        </div>
    </div>
@stop
