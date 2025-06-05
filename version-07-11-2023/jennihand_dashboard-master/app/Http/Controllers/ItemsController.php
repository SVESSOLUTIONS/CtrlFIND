<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Mail;
use App\Models\Item;
use App\Models\User;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\ItemCategory;
use Illuminate\Http\Request;
use App\Models\RefundRequest;
use App\Models\ProviderCategory;
use TCG\Voyager\Models\Category;
use App\Mail\requestCategoryEmail;
use App\Models\UserProviderCategory;
use Illuminate\Support\Facades\Validator;

class ItemsController extends Controller
{
    function addItem()
    {
        $validator = Validator::make(\Request::all(), [
            'category' => 'required',
            'title' => 'required',
            'price' => 'required',
            'summary' => 'required',
            'discription' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors,402);
        }

        $product = new Item();
        $product->published = \Request::input('published');
        $product->featured = \Request::input('featured');
        $product->category_id = \Request::input('category');
        $product->title = \Request::input('title');
        $product->summary = \Request::input('summary');
        $product->discription = \Request::input('discription');
        $product->price = \Request::input('price');
        $product->discount = \Request::input('discount');
        if(!empty(\Request::input('discount_start_date')))
        {
            $product->discount_start_date = \Request::input('discount_start_date');
        }
        if(!empty(\Request::input('discount_end_date')))
        {
            $product->discount_start_date = \Request::input('discount_end_date');
        }

        $product->UserId = \Auth::user()->id;

        if($product->save()){
            return response()->json(['type' => 'success'],200);
        }

        return response()->json(['type' => 'error'],422);

    }

    public function getCategories()
    {
        $lang = \Request::input('lang');
        $categories = ItemCategory::orderBy('created_at','ASC')->get();

        if(!empty($lang)){
            $categories = $categories->translate($lang,'fallbacklocally');
        }
        return response()->json(['categories' => $categories],200);
    }

    public function addProviderCategories()
    {
        $user = auth()->user();
        if($user->role_id == 2) return response()->json(['message' => 'Your are not authorized'],401);
        $user_id =  $user->id;
        $categories_ids = json_decode(request()->categories);
        UserProviderCategory::where('user_id' ,$user_id)
        ->whereNotIn('provider_category_id' , $categories_ids)->update(['is_deleted' => 1]);
        UserProviderCategory::where('user_id' ,$user_id)
        ->whereIn('provider_category_id' , $categories_ids)->update(['is_deleted' => 0]);
        $cat_collection = collect($categories_ids);
        $cat_collection->map(function ($id) use ($user_id) {
            UserProviderCategory::firstOrCreate([
            'user_id' => $user_id,
            'provider_category_id' => $id]);
        });
        $provider_categories_ids = UserProviderCategory::where([
                    'user_id'  => $user_id , 'is_deleted' => 0])
                    ->pluck('provider_category_id');
        $provider_categories = ItemCategory::whereIn('id' , $provider_categories_ids)->get();
        return response()->json(['provider_categories' => $provider_categories ,
        'provider_categories_ids' => $provider_categories_ids],200);
    }

    public function getProviderCategories()
    {
        $user = auth()->user();
        if($user->role_id == 2) return response()->json(['message' => 'Your are not authorized'],401);
        $user_id = $user->id;
        $provider_categories_ids = UserProviderCategory::where([
            'user_id'  => $user_id , 'is_deleted' => 0])
            ->pluck('provider_category_id');
        $provider_categories = ItemCategory::whereIn('id' , $provider_categories_ids)->get();

        $lang = \Request::input('lang');

        if ($lang && $lang !== 'en') {
            // If the selected language is not English, translate the categories
            $provider_categories = $provider_categories->translate($lang,'fallbacklocally');
        }

        return response()->json(['provider_categories' => $provider_categories ,
        'provider_categories_ids' => $provider_categories_ids],200);
    }

    public function getCategoryProviders (ItemCategory $itemCategory) {
        $provider_ids = UserProviderCategory::where([
            'provider_category_id'  => $itemCategory->id , 'is_deleted' => 0])
            ->pluck('user_id');
        $category_providers = User::whereIn('id' , $provider_ids)->get();
        return response()->json(['category_providers' => $category_providers],200);
    }

    public function addProvider()
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors,402);
        }

        $parent_id = 0 ;
        if(!empty(\Request::input('parent_id')))
        {
            $parent_id = \Request::input('parent_id');
        }

        $provider = new ProviderCategory();
        $provider->name = \Request::input('name');
        $provider->parent_id = $parent_id;
        $provider->description = \Request::input('description');
        $provider->photo = '';

        if($provider->save()){
            return response()->json(['type' => 'success'],200);
        }

        return response()->json(['type' => 'error'],422);
    }
    function getProviders()
    {
        $providers = ProviderCategory::get();

        return response()->json(['providers' => $providers],200);
    }
    function getCoupn()
    {
        $coupn = \Request::input('coupon');
        $coupon = Coupon::where('coupon',$coupn)->first();
        if (!$coupon) {
            // The coupon code is invalid
            return response()->json(['error' => 'Invalid coupon code'], 402);
        }
        if ($coupon->end_date && Carbon::now()->gt($coupon->end_date)) {
            // The coupon has expired
            return response()->json(['error' => 'This coupon has expired'], 404);
        }
        return response()->json(['coupon' => $coupon]);
    }
    function requestRefund(){
        $name = \Request::input('name');
        $phone = \Request::input('phone');
        $email = \Request::input('email');
        $order = \Request::input('order');
        $description = \Request::input('description');

        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'phone' => 'required',
            'email' => 'required',
            'order' => 'required',
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors,402);
        }

        $refundRequest = new RefundRequest();

        $refundRequest->name = $name;
        $refundRequest->phone = $phone;
        $refundRequest->email = $email;
        $refundRequest->order = $order;
        $refundRequest->description = $description;
        $requestedOrder = Order::where('order_nr' , $order)->first();
        $requestedOrder->refund_status  = 'requested';
        $requestedOrder->save();
        if($refundRequest->save()){
            return response()->json(['type' => 'success'],200);
        }

        return response()->json(['type' => 'error'],422);

    }

    function requestCategory()
    {
        $validator = Validator::make(\Request::all(), [
            'category_name' => 'required',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors,422);
        }
        $user = auth()->user();
        $admin = User::where('role_id', 1)->first();
        Mail::to($admin->email)->send(new requestCategoryEmail($user->name, request()->category_name));
        return response()->json(['message' => 'Your request has been sent successfully']);

    }
}
