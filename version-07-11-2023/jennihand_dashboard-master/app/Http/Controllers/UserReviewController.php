<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserReview;

class UserReviewController extends Controller
{
    function addUserReview()
    {
        $validator = Validator::make(\Request::all(), [
            'user_id' => 'required',
            'order_id' => "required",
            'rating' => "required|integer|min:0|max:5",
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        
         $user = auth()->user();
         $review = new UserReview();
         $review->user_id = request()->user_id;
         $review->order_id = request()->order_id;
         $review->creator_id = $user->id;
         $review->rating = request()->rating;
         if(request()->comment) {
         $review->comment = request()->comment;
         }else{
         $review->comment = '';
         }
        
         if($review->save())
         {
             return response()->json($review);
         }
    }

    function removeUserReview(UserReview $review)
    {
        $review->delete();
        return response()->noContent();
    }
}
