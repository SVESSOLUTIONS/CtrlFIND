<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\ItemReview;
use App\Models\UserReview;
use App\Models\User;
use App\Models\Item;


class ItemReviewController extends Controller
{
    function addItemReview()
    {
        $validator = Validator::make(\Request::all(), [
            'item_id' => 'required',
            'rating' => "required|integer|min:0|max:5",
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        
         $user = auth()->user();
         $review = new ItemReview();
         $review->item_id = request()->item_id;
         $review->creator_id = $user->id;
         $review->rating = request()->rating;
         if(request()->comment) {
         $review->comment = request()->comment;
         }else{
         $review->comment = '';
         }
        
         if($review->save())
         {
            $user =  User::find($review->creator_id , ['id' , 'name']);
            $avg = UserReview::where('user_id' , $user->id)->get()->avg('rating');
            $total = UserReview::where('user_id' , $user->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $user->setAttribute("rating" , $rating);
            $review->setAttribute('user' , $user);
            $item_avg = ItemReview::where('item_id' , request()->item_id)->get()->avg('rating');
            $item_total = ItemReview::where('item_id' , request()->item_id)->count();
            $item_rating = ["avg" => $item_avg ? $item_avg : 0 , "total" => $item_total];
             return response()->json(['rating' => $item_rating , 'review' => $review]);
         }
    }

    function removeItemReview(ItemReview $review)
    {
        $review->delete();
        return response()->noContent();
    }

    public function getProviderReviews($id)
    {
        $items = Item::where('UserId', $id)->get();
        $reviews_arr = array();
        if (count($items) > 0) {
        
            foreach ($items as $key => $item) {
                $reviews_arr[] = $item->reviews;
            }
            $res = array();
            foreach ($reviews_arr as $key => $value) {
                foreach ($value as $key => $review) {
                    $res[] = $review;
                }
            }
            foreach ($res as $key => $review) {
                $user = User::find($review->creator_id);
                $review->setAttribute('creater', $user);
            }
            return response()->json($res);
        }
        return response()->json(['message' => 'Provider does not have any product.']);
    }
}
