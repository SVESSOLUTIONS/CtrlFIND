<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\User;
use App\Models\ItemCategory;
use App\Models\UserReview;
use App\Models\ItemReview;
use App\Models\MediaFile;
use App\Models\Attribute;
use App\Models\Tag;
use App\Models\ItemTag;
use App\Models\Item;
use App\Models\UserProviderCategory;
use Spatie\QueryBuilder\QueryBuilder;




class BuyerDashboardController extends Controller
{
    function getDashboardProviderByCategory(ItemCategory $ItemCategory , Request $request)
    {

       $auth_user = auth('sanctum')->user();
       if($request->lat and $request->lng) {
           if($auth_user) {
             $auth_user->update(['lat' => $request->lat , 'lng' => $request->lng]);
           }
       }
       $ids = [];
       $ids = $auth_user ? array($auth_user->id) : [];
       $provoder_ids  = UserProviderCategory::where(['provider_category_id' => $ItemCategory->id , 'is_deleted' => 0])->pluck('user_id');
       $providers = User::select(['id' , 'name' ,'about', 'email' ,'avatar' , 'phone','website','is_featured','is_trusted',
        'address_home' , 'address_office',
        'provider_lat' , 'provider_lng' ,'place_id' ,'place_id_office'])
       ->whereIn('id' , $provoder_ids)->whereNotIn('id' , $ids)
       ->whereNotNull('provider_lat')->when($request->lng and $request->lat , function($query) use ($request) {
           $query->addSelect(DB::Raw("ST_Distance_Sphere(
               POINT('$request->lng', '$request->lat'), POINT(provider_lng , provider_lat)
           ) as distance"))->orderBy('distance');
       })
       ->get();

       $distance_array = [];
       foreach ($providers as $provider) {
            $avg = UserReview::where('user_id' , $provider->id)->get()->avg('rating');
            $total = UserReview::where('user_id' , $provider->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            array_push($distance_array , $provider->distance);
            $privider_high_price = Item::where('Userid' , $provider->id)->orderBy("price" , 'DESC')->first('price');
            $provider_low_price  = Item::where('Userid' , $provider->id)->orderBy("price" , 'ASC')->first('price');
            $provider->setAttribute("rating" , $rating);
            $provider->setAttribute("price_order" , $this->getPriceLowAndHigh($privider_high_price , $provider_low_price));
       }

       $max_distance = 0;
       $min_distance = 0;

       if($distance_array) {
        $max_distance = max($distance_array);
        $min_distance = min($distance_array);
       }

       $item_high_price = Item::whereIn('Userid',$provoder_ids)->orderBy("price" , 'DESC')->first('price');
       $item_low_price  = Item::whereIn('Userid',$provoder_ids)->orderBy("price" , 'ASC')->first('price');

       $data = [
           'providers' => $providers,
           'item_price_order' => $this->getPriceLowAndHigh($item_high_price , $item_low_price),
           'user_distance_order' => ['max' => $max_distance , 'min' => $min_distance]
            ];

       return response()->json($data);

    }

    public function getDashboardProviderServices(User $user , Request $request)
    {
        $request->validate([
            'category_id' => 'required'
        ]);
      $lang = $request->get('lang');
        $user_services = Item::where(['Userid' => $user->id ,'category_id' => $request->category_id, 'item_type' => 'service'])
        ->latest()->get(['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date', 'employee_id']);
      if (!is_null($lang)) {
        $user_services = $user_services->translate($lang, 'fallbacklocally');
      }
        foreach ($user_services as $user_service ) {

            $avg = ItemReview::where('item_id' , $user_service->id)->get()->avg('rating');
            $total = ItemReview::where('item_id' , $user_service->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $image = MediaFile::where('item_id', $user_service->id)->first('file_path');
            /*$user_service->setAttribute('image' , $image);
            $user_service->setAttribute('rating' , $rating);*/
          $user_service->image = $image;
          $user_service->rating = $rating;

        }

        $item_high_price = Item::where(['Userid' => $user->id ,
        'category_id' => $request->category_id, 'item_type' => 'service'])
        ->orderBy("price" , 'DESC')->first('price');
        $item_low_price  = Item::where(['Userid' => $user->id ,'category_id' => $request->category_id,
         'item_type' => 'service'])
        ->orderBy("price" , 'ASC')->first('price');

        $data = [
        'services' => $user_services ,
        'service_price_order' => $this->getPriceLowAndHigh($item_high_price , $item_low_price),
        ];
        return response()->json($data);

    }

    public function getDashboardProviderProducts(User $user , Request $request)
    {
        $request->validate([
            'category_id' => 'required'
        ]);
      $lang = $request->get('lang');

        $user_products = Item::where(['Userid' => $user->id ,
        'category_id' => $request->category_id,
         'item_type' => 'product'])
        ->latest()->get(['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount' ,
        'discount_start_date' , 'discount_end_date']);
      if (!is_null($lang)) {
        $user_products = $user_products->translate($lang, 'fallbacklocally');
      }
        foreach ($user_products as $user_product ) {
            $avg = ItemReview::where('item_id' , $user_product->id)->get()->avg('rating');
            $total = ItemReview::where('item_id' , $user_product->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $image = MediaFile::where('item_id', $user_product->id)->first('file_path');
            //$user_product->setAttribute('image' , $image);
           // $user_product->setAttribute('rating' , $rating);
          $user_product->image = $image;
          $user_product->rating = $rating;
        }

        $item_high_price = Item::where(['Userid' => $user->id ,
        'category_id' => $request->category_id,
        'item_type' => 'product']
        )->orderBy("price" , 'DESC')->first('price');
        $item_low_price  = Item::where(['Userid' => $user->id ,
        'category_id' => $request->category_id,
         'item_type' => 'product'])
        ->orderBy("price" , 'ASC')->first('price');

        $data = [
            'products' => $user_products ,
            'product_price_order' => $this->getPriceLowAndHigh($item_high_price , $item_low_price),
        ];
        return response()->json($data);
    }

    public function getProviderItemDetails(Item $item) {

        $images = MediaFile::where('item_id', $item->id)->get(['id','file_path']);
        $colors = Attribute::where(['item_id' => $item->id , 'type' => 'colors',
        'is_deleted' => 0])->get(['id','label' , 'value']);
        $sizes = Attribute::where(['item_id' => $item->id , 'type' => 'sizes',
        'is_deleted' => 0])->get(['id','label' , 'value']);
        $item_tag_ids = ItemTag::where('item_id', $item->id)->pluck('tag_id');
        $tags = Tag::whereIn('id' , $item_tag_ids)->get(['id','name']);

        $item_avg = ItemReview::where('item_id' , $item->id)->get()->avg('rating');
        $item_total = ItemReview::where('item_id' , $item->id)->count();
        $item_rating = ["avg" => $item_avg ? $item_avg : 0 , "total" => $item_total];

        $reviews = ItemReview::where('item_id' , $item->id)->get();

        foreach ($reviews as $review) {
             $user =  User::find($review->creator_id , ['id' , 'name']);
             $avg = UserReview::where('user_id' , $user->id)->get()->avg('rating');
             $total = UserReview::where('user_id' , $user->id)->count();
             $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
             $user->setAttribute("rating" , $rating);
             $review->setAttribute('user' , $user);
        }

        $item->setAttribute('images' , $images);
        $item->setAttribute('colors' , $colors);
        $item->setAttribute('sizes' , $sizes);
        $item->setAttribute('tags' , $tags);
        $item->setAttribute('rating' , $item_rating);
        $item->setAttribute('reviews' , $reviews);

        return response()->json($item);
    }

    public function getPriceLowAndHigh($item_high_price ,$item_low_price)
    {
       return [
            'high' =>  $item_high_price ?  $item_high_price->price  : 0,
            'low' => $item_low_price ? $item_low_price->price : 0
       ];
    }

    function searchService()
    {
        $lang = request()->lang;
        $search = request()->search ?? "";
        $items =  Item::where('title' ,'LIKE',"%{$search}%")->latest()->take(20)->get(['id','category_id','title','price','discount_available' ,
         'discount', 'discount_type', 'discount_start_date','UserId', 'discount_end_date','item_type']);

         foreach ($items as $item) {
            $image = MediaFile::where('item_id', $item->id)->first(['id','file_path']);
            $provider = User::find($item->UserId , ['id' , 'name']);
            $category = ItemCategory::find($item->category_id);
             if(!empty($lang))
            {
                $category =$category->translate($lang,'fallbacklocally');;
            }
            $item->setAttribute('image' , $image);
            $item->setAttribute('provider' , $provider);
            $item->setAttribute('category' , $category);
         }
        return response()->json($items);
    }
}
