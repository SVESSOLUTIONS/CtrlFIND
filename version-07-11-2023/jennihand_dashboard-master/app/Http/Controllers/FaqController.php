<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\UserSubscriptions;
use App\Models\Payment;
use Carbon\Carbon;
use Auth;
use Session;
use Redirect;
use DB;
use TCG\Voyager\Models\Page;


class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $data['data'] = Faq::all();
        $data['count'] = count($data['data']);
        return view('/vendor/voyager/Faq/index')->with('data',$data);
    }
    public function getFaq(Request $request)
    {
        $lang = $request->input('lang');
        $faq = Faq::orderBy('sort_order','ASC')->get();
    
        if(!empty($lang)){
            $faq = $faq->translate($lang,'fallbacklocally');
        }
        return response()->json(['faqs' => $faq],200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {

        return view('/vendor/voyager/Faq/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {

        DB::table('faqs')->truncate();
        $data = array();
        if($request)
        {
            foreach ($request->title as $k=>$item) {
                $data[] = array(
                    'title'=>$item,
                    'description'=>$request->description[$k],
                    );
            }
            DB::table('faqs')->insert(
                [
                    'body' => json_encode($data),
                    'slug' => 'faqs',
                    'created_at' => Carbon::now(),
                ]
            );
        }
        Session::flash('message', 'Successfully updated faq!');
        return Redirect::to('admin/faqs');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $faq = Faq::find($id);
        return view('/vendor/voyager/Faq/edit')->with('faq',$faq);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request,$id)
    {
        $faq = Faq::find($id);
        $data = array();
        if($request)
        {
            foreach ($request->title as $k=>$item) {
                $data[] = array(
                    'title'=>$item,
                    'description'=>$request->description[$k],
                );
            }
            $faq->slug = 'faqs';
            $faq->body = json_encode($data);
            $faq->save();
        }
        Session::flash('message', 'Successfully updated faq!');
        return Redirect::to('admin/faqs');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

}
