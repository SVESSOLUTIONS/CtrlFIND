<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Item;
use App\Models\MediaFile;
use App\Models\ItemReview;
use App\Models\ItemTag;
use App\Models\Tag;
use App\Models\Attribute;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class UserItemsController extends Controller
{

    public function getUserProducts()
    {
        $user = \Auth::user();
        $user_products = Item::where(['Userid' => $user->id , 'item_type' => 'product'])
        ->latest()->get(['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount' ,
        'discount_start_date' , 'discount_end_date']);

        foreach ($user_products as $user_product ) {
            $avg = ItemReview::where('item_id' , $user_product->id)->get()->avg('rating');
            $total = ItemReview::where('item_id' , $user_product->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $image = MediaFile::where('item_id', $user_product->id)->first('file_path');
            $user_product->setAttribute('image' , $image);
            $user_product->setAttribute('rating' , $rating);
        }
        return response()->json($user_products);
    }


    public function AddUserProducts()
    {

        $validator = Validator::make(\Request::all(), [
            'title' => 'required',
            'price' => 'required',
            'category_id' => 'required',
        ]);

        if(request()->discount_available === 'Y') {
        $validator = Validator::make(\Request::all(), [
                'discount' => 'required',
                'discount_type' => 'required',
                'discount_start_date' => 'required',
                'discount_end_date' => 'required',
            ]);
        }
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = \Auth::user();

        $subscribe = $this->CheckIfUerSubscribed($user);

        if(!$subscribe)
        {
            return response()->json(['message' => "You are not subscribed."],400);
        }

        $count = Item::where(['Userid' => $user->id , 'item_type' => 'product'])->count();

        if($subscribe['package']->allowed_products <= $count) {
            return response()->json(['message' => "allowed products limit exceed."],400);
        }

        $product = new Item();
        $product->item_type = 'product';
        $product->UserId = $user->id;
        $product->title = request()->title;
        $product->price = request()->price;
        $product->discount_available = request()->discount_available;
        if(request()->discount_available === 'Y') {
            $product->discount = request()->discount;
            $product->discount_type = request()->discount_type;
            $product->discount_start_date = request()->discount_start_date;
            $product->discount_end_date = request()->discount_end_date;
        }

        if(request()->taxable) {
          $product->taxable = request()->taxable;
        }
        $product->featured = 0;
        $product->category_id = request()->category_id;
        $product->summary = request()->summary;
        $product->save();

        $colors = json_decode(request()->colors);
        $sizes  = json_decode(request()->sizes);
        $images = json_decode(request()->images);
        $tags   = json_decode(request()->tags);

        $tag_ids = [];
        if($tags) {
            foreach ($tags as $tagsName) {
                $tag = Tag::firstOrCreate(['name'=>$tagsName , 'creator_id' => $user->id]);
                if($tag)
                {
                   $tag_ids[] = $tag->id;
                }
            }
          $product->tags()->syncWithoutDetaching($tag_ids);
        }

        if($colors) {
            foreach ($colors as $color ) {
                $clr = new Attribute();
                $clr->item_id = $product->id;
                $clr->label = $color->label;
                $clr->value = $color->value;
                $clr->type = "colors";
                $clr->save();
            }
        }if($sizes) {
            foreach ($sizes as $size ) {
                $siz = new Attribute();
                $siz->item_id = $product->id;
                $siz->label = $size->label;
                $siz->value = $size->value;
                $siz->type = "sizes";
                $siz->save();
            }
        }if($images) {
            foreach ($images as $image ) {
                  $save_path = $this->makeImage($image->uri);
                  $media = new MediaFile();
                  $media->item_id = $product->id;
                  $media->title = $image->fileName;
                  $media->file_path = $save_path;
                  $media->file_type = $image->type;
                  $media->position = 1;
                  $media->save();
              }
        }
        $fresh_product = Item::find($product->id,['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date']);
        $avg = ItemReview::where('item_id' , $fresh_product->id)->get()->avg('rating');
        $total = ItemReview::where('item_id' , $fresh_product->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        $image = MediaFile::where('item_id', $fresh_product->id)->first('file_path');
        $fresh_product->setAttribute('image' , $image);
        $fresh_product->setAttribute('rating' , $rating);
        return response()->json($fresh_product);

    }

    public function getUserServices()
    {
        $user = \Auth::user();
        $user_services = Item::where(['Userid' => $user->id , 'item_type' => 'service'])
        ->latest()->get(['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date']);

        foreach ($user_services as $user_service ) {
         
            $avg = ItemReview::where('item_id' , $user_service->id)->get()->avg('rating');
            $total = ItemReview::where('item_id' , $user_service->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $image = MediaFile::where('item_id', $user_service->id)->first('file_path');
            $user_service->setAttribute('image' , $image);
            $user_service->setAttribute('rating' , $rating);
            if ($user_service->discount_end_date != null && date($user_service->discount_end_date)<date('Y-m-d')) {
                $user_service->discount_available = "N";
                $user_service->discount = 0;
                $user_service->discount_start_date = null;
                $user_service->discount_end_date = null;
            }

        }

        return response()->json($user_services);
    }

    public function AddUserServices()
    {
        $validator = Validator::make(\Request::all(), [
            'title' => 'required',
            'price' => 'required',
            'category_id' => 'required',
            'employee_id' => 'required',
        ]);

        if(request()->discount_available === 'Y') {
        $validator = Validator::make(\Request::all(), [
                'discount' => 'required',
                'discount_type' => 'required',
                'discount_start_date' => 'required',
                'discount_end_date' => 'required',
            ]);
        }
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = \Auth::user();

        $subscribe = $this->CheckIfUerSubscribed($user);

        if(!$subscribe)
        {
            return response()->json(['message' => "You are not subscribed."],400);
        }

        $count = Item::where(['Userid' => $user->id , 'item_type' => 'service'])->count();
        
        if($subscribe['package']->allowed_services <= $count)
        {
            return response()->json(['message' => "allowed services limit exceed."],400);
        }

        $service = new Item();
        $service->item_type = 'service';
        $service->UserId = $user->id;
        $service->title = request()->title;
        $service->price = request()->price;
        $service->discount_available = request()->discount_available;
        if(request()->discount_available === 'Y') {
            $service->discount = request()->discount;
            $service->discount_type = request()->discount_type;
            $service->discount_start_date = request()->discount_start_date;
            $service->discount_end_date = request()->discount_end_date;
        }
        $service->featured = 0;
        $service->category_id = request()->category_id;
        $service->location = request()->location;
        $service->price_type = request()->price_type;
        $service->require_appointment = request()->require_appointment;
        $service->summary = request()->summary;
        $service->employee_id = request()->employee_id;
        if(request()->taxable) {
            $service->taxable = request()->taxable;
        }
        if(request()->pick_up_availible) {
            $service->pick_up_availible = request()->pick_up_availible;
        }if(request()->delivery_availible) {
            $service->delivery_availible = request()->delivery_availible;
        }
        $service->save();

    
        $images = json_decode(request()->images);

        if($images) {
            foreach ($images as $image ) {
                  $save_path = $this->makeImage($image->uri);
                  $media = new MediaFile();
                  $media->item_id = $service->id;
                  $media->title = $image->fileName;
                  $media->file_path = $save_path;
                  $media->file_type = $image->type;
                  $media->position = 1;
                  $media->save();
              }
        }
        $fresh_service = Item::find($service->id,['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date' , 'employee_id']);
        $avg = ItemReview::where('item_id' , $fresh_service->id)->get()->avg('rating');
        $total = ItemReview::where('item_id' , $fresh_service->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        $image = MediaFile::where('item_id', $fresh_service->id)->first('file_path');
        $fresh_service->setAttribute('image' , $image);
        $fresh_service->setAttribute('rating' , $rating);
        return response()->json($fresh_service);

    }

    public function updateItem(Item $item) {
        $validator = Validator::make(\Request::all(), [
            'title' => 'required',
            'price' => 'required',
            'category_id' => 'required',
        ]);

        if(request()->discount_available === 'Y') {
        $validator = Validator::make(\Request::all(), [
                'discount' => 'required',
                'discount_type' => 'required',
                'discount_start_date' => 'required',
                'discount_end_date' => 'required',
            ]);
        }
        if($item->item_type === 'service') {
            $validator = Validator::make(\Request::all(), [
                'employee_id' => 'required',
            ]);
        }

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = \Auth::user();

        $item->title = request()->title;
        $item->price = request()->price;
        $item->discount_available = request()->discount_available;
        if(request()->discount_available === 'Y') {
            $item->discount = request()->discount;
            $item->discount_type = request()->discount_type;
            $item->discount_start_date = request()->discount_start_date;
            $item->discount_end_date = request()->discount_end_date;
        }
        $item->category_id = request()->category_id;
        if(request()->location) {
            $item->location = request()->location;
        }
        if(request()->require_appointment) {
            $item->require_appointment = request()->require_appointment;
        }
        $item->summary = request()->summary;
        if(request()->taxable) {
            $item->taxable = request()->taxable;
        }
        if($item->item_type === 'service') {
           $item->employee_id = request()->employee_id;
        }
        if(request()->pick_up_availible) {
            $item->pick_up_availible = request()->pick_up_availible;
        }if(request()->delivery_availible) {
            $item->delivery_availible = request()->delivery_availible;
        }
        $item->save();

        $images = json_decode(request()->images);
        $colors = json_decode(request()->colors);
        $sizes  = json_decode(request()->sizes);
        $tags   = json_decode(request()->tags);

        $tag_ids = [];

      
        Attribute::where(['item_id' => $item->id])->update(['is_deleted' => 1]);

        

        if($colors) {
            foreach ($colors as $color ) {
               $attribute =  Attribute::firstOrCreate([
                    'item_id' => $item->id,
                    'label' => $color->label,
                    'value' => $color->value,
                    'type' => "colors",
                ]);
                $attribute->is_deleted = 0;
                $attribute->save();
            }
        } if($sizes) {
            foreach ($sizes as $size ) {
                $attribute =  Attribute::firstOrCreate([
                    'item_id' => $item->id,
                    'label' => $size->label,
                    'value' => $size->value,
                    'type' => "sizes",
                ]);
                $attribute->is_deleted = 0;
                $attribute->save();
            }
        }if($tags) {
            foreach ($tags as $tagsName) {
                $tag = Tag::firstOrCreate(['name'=>$tagsName , 'creator_id' => $user->id]);
                if($tag)
                {
                   $tag_ids[] = $tag->id;
                }
            }
        }
        $item->tags()->sync($tag_ids);
        if($images) {
            foreach ($images as $image ) {
                  $save_path = $this->makeImage($image->uri);
                  $media = new MediaFile();
                  $media->item_id = $item->id;
                  $media->title = $image->fileName;
                  $media->file_path = $save_path;
                  $media->file_type = $image->type;
                  $media->position = 1;
                  $media->save();
              }
        }
        $fresh_item = Item::find($item->id,['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date' , 'employee_id']);
        $avg = ItemReview::where('item_id' , $fresh_item->id)->get()->avg('rating');
        $total = ItemReview::where('item_id' , $fresh_item->id)->count();
        $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
        $image = MediaFile::where('item_id', $fresh_item->id)->first('file_path');
        $fresh_item->setAttribute('image' , $image);
        $fresh_item->setAttribute('rating' , $rating);
        return response()->json($fresh_item);
    }

    public function deleteItem(Item $item)
    {
       $reviews = ItemReview::where('item_id' , $item->id)->get();
       $images  = MediaFile::where('item_id', $item->id)->get();
       $attributes  = Attribute::where('item_id', $item->id)->get();
       foreach($reviews as $review)
       {
           $review->delete();
       }
       foreach($images as $image)
       {
          $file_path = $image->file_path;
          $this->DeleteIfFileExistInStorage($file_path);
          $image->delete();
       }
       foreach($attributes as $attribute)
       {
           $attribute->delete();
       }
       $item->tags()->sync([]);
       $item->delete();
       return response()->noContent();
    }

    public function getItemDetails(Item $item) {
        $images = MediaFile::where('item_id', $item->id)->get(['id','file_path']);
        $colors = Attribute::where(['item_id' => $item->id , 'type' => 'colors',
        'is_deleted' => 0])->get(['id','label' , 'value']);
        $sizes = Attribute::where(['item_id' => $item->id , 'type' => 'sizes',
        'is_deleted' => 0])->get(['id','label' , 'value']);
        $item_tag_ids = ItemTag::where('item_id', $item->id)->pluck('tag_id');
        $tags = Tag::whereIn('id' , $item_tag_ids)->get(['id','name']);
        $item->setAttribute('images' , $images);
        $item->setAttribute('colors' , $colors);
        $item->setAttribute('sizes' , $sizes);
        $item->setAttribute('tags' , $tags);
        return response()->json($item);
    }

    public function removeMedia(MediaFile $media)
    {
        if (File::exists($media->file_path)) {
            File::delete($media->file_path);
        }
        $media->delete();
        return response()->json(['message' => 'success']);
    }




    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "items/images/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }

    public function DeleteIfFileExistInStorage($file) {
        if($file) {
            $current_photo_path = public_path('/storage/') . $file;
        if (file_exists($current_photo_path)) {
            @unlink($current_photo_path);
          }
        }
    }
    
}
