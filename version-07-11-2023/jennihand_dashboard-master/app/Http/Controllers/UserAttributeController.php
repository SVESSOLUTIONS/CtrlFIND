<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Color;
use App\Models\Items;
use App\Models\Tag;
use App\Models\Size;
use App\Models\Employee;
use App\Models\UserProviderCategory;
use App\Models\ItemCategory;
use App\Models\UserReview;
use App\Models\Attribute;
use App\Models\Order;
use App\Models\User;
use App\Models\Item;
use Illuminate\Support\Facades\Validator;


class UserAttributeController extends Controller
{

    public function getTag()
    {
        $tags = Tag::all();
        return response()->json($tags);
    }

    public function getProviderByTags(Request $request)
    {
        $temp = array();
        foreach ($request['tags'] as $key => $tag) {
            $tag = Tag::find($tag);
            if($tag){
                foreach ($tag->items()->groupBy('UserId')->get() as $key => $item) {
                    $temp[] = User::find($item->UserId);
                }
            }
        }
        $collection = collect($temp);
        $providers = array();
        foreach ($collection->unique() as $key => $provider) {
            $providers[] = $provider;
        }
        return response()->json($providers);
    }

    public function getProviderProfile($id)
    {
        $user = User::find($id);
        $total_orders = Order::where($user->role_id === 3 ? 'provider_id' : 'user_id' , $user->id)->count();
        $total_balance = 0;
        $avg = UserReview::where('user_id' , $user->id)->get()->avg('rating');
        $total = UserReview::where('user_id' , $user->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        return response()->json(['user' => $user ,
            'total_orders' => $total_orders ,'total_balance' => $total_balance,
            'rating' => $rating], 200);
    }

    public function createTag()
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required|min:2|max:30',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $user = \Auth::user();

        $tag = Tag::firstOrCreate(['creator_id'=>$user->id, 'name' => request()->name]);
        return response()->json($tag->refresh());
    }

    public function removeTag(Tag $tag)
    {
       $tag->delete();
       return response()->noContent();
       
    }

    public function getProviderData()
    {
        $user = \Auth::user();
        $colors = Color::where('user_id' , $user->id)->latest()->get(['id' , 'label' , 'value']);
        $sizes = Size::where('user_id' , $user->id)->latest()->get(['id' , 'label' , 'value']);
        $tags = Tag::where('creator_id' , $user->id)->latest()->get(['id' , 'name']);
        $employees = Employee::where('user_id' , $user->id)->latest()->get(['id' , 'name']);
        $provider_categories_ids = UserProviderCategory::where([
            'user_id'  => $user->id , 'is_deleted' => 0])
            ->pluck('provider_category_id');

        $provider_categories = [];
        $categories = ItemCategory::whereIn('id' , $provider_categories_ids)->get(['id' , 'name']);

        $provider_categories = $categories->map(function($item, $key) {
            return ['label' => $item->name , 'value' => $item->id];
         });

        $response = [
            "provider_categories" => $provider_categories,
            "provider_colors" => $colors,
            "provider_sizes" => $sizes,
            "provider_tags" => $tags,
            'provider_employees' => $employees
        ];

        return response()->json($response);
    }

    public function getColors()
    {
        $user = \Auth::user();
        $colors = Color::where('user_id' , $user->id)->get();
        return response()->json($colors);
    }

    public function addColor()
    {
        $validator = Validator::make(\Request::all(), [
            'label' => 'required',
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $user = \Auth::user();

        $color = new Color();
        $color->user_id = $user->id;
        $color->label = request()->label;
        $color->value = request()->value;

        if($color->save()) {
            return response()->json($color);
        }
    }

    public function editColor(Color $color)
    {
        $validator = Validator::make(\Request::all(), [
            'label' => 'required',
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $color->label = request()->label;
        $color->value = request()->value;

        if($color->save()) {
            return response()->json($color);
        }
    }

    public function removeColor(Color $color)
    {
        $user = User::find($color->user_id);
        $items =  Item::where("UserId" , $user->id)->pluck('id');
        $isExists = Attribute::whereIn('item_id',$items)->where(['type' => 'colors' , 'value' => $color->value])->exists();
        if($isExists) {
            return response()->json(['message' => 'Cannot delete color because it is currently in use.'] , 400);
        }else {
            $color->delete();
            return response()->json(['message' => "success"]);
        }
       
    }

   
  
        
    public function getSizes()
    {
        $user = \Auth::user();
        $sizes = Size::where('user_id' , $user->id)->get();
        return response()->json($sizes);
    }
    
    public function addSize()
    {
        $validator = Validator::make(\Request::all(), [
            'label' => 'required',
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = \Auth::user();

        $size = new Size();
        $size->user_id = $user->id;
        $size->label = request()->label;
        $size->value = request()->value;

        if($size->save()) {
            return response()->json($size);
        }
    }

    public function editSize(Size $size)
    {
        $validator = Validator::make(\Request::all(), [
            'label' => 'required',
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $size->label = request()->label;
        $size->value = request()->value;

        if($size->save()) {
            return response()->json($size);
        }
    }

    public function removeSize(Size $size)
    {
        $user = User::find($size->user_id);
        $items =  Item::where("UserId" , $user->id)->pluck('id');
        $isExists = Attribute::whereIn('item_id',$items)->where(['type' => 'sizes', 'value' => $size->value])->exists();

        if(Attribute::where('value' , $size->value)->exists()) {
            return response()->json(['message' => 'Cannot delete size because it is currently in use.'] , 400);
        }else {
            $size->delete();
            return response()->json(['message' => "success"]);
        }
    }
}
