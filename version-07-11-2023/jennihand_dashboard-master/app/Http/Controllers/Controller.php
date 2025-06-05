<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Province;
use Illuminate\Support\Str;
use App\Models\Subscription;
use App\Models\UserAddresses;
use App\Models\UserSubscriptions;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

       //  user
    function me($user_id)
    {
        $user =  User::where('id', $user_id)->first();
        $user_subsriptions = UserSubscriptions::where('user_id',$user->id)->get();
        $is_subscribed = $this->CheckIfUerSubscribed($user);
        $is_tracking = $this->CheckIsTracking($user);
        $province = null;
        if($user->province_id) {
         $province = Province::find($user->province_id);
        }
        if($user->state && !$province) {
            $province = Province::where('name' , $user->state)->first();
        }
        $user->setAttribute('is_subscribed' , $is_subscribed);
        $user->setAttribute('is_tracking' , $is_tracking);
        $user->setAttribute('province' , $province);
        return $user;
    }

    public function CheckIfUerSubscribed($user) {
        $is_subscribed = null;
        $is_subscribed =  UserSubscriptions::where(['user_id' => $user->id,
        'status' => 'ACTIVE'])->first();
        if($is_subscribed) {
            if($is_subscribed->expires_at !== null) {
               if($is_subscribed->expired()) {
                $is_subscribed->status = 'EXPIRE';
                $is_subscribed->save();
                return null;
               }else{
                $up = Subscription::find($is_subscribed->subscription_id);
                $package = ['package' => $up , 'purchase_date' => $is_subscribed->purchase_date];
                $is_subscribed = $package;
               }
            }else{
                $is_subscribed->status = 'EXPIRE';
                $is_subscribed->save();
                return null;
            }
            
        }
        return $is_subscribed;
    }
    public function CheckIsTracking($user) {
        $order = Order::where(['provider_id' => $user->id , 'is_tracking' => 1])->first();
        if($order) {
            return true;
        }else{
            return false;
        }
    }

    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "users/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }

    function putFileAs($path, $file)
    {
        $fileName = Str::random() . "." . $file->extension();
        return Storage::putFileAs(
            $path,
            $file,
            $fileName,
            [
                'visibility' => 'public',
                'directory_visibility' => 'public'
            ]
        );
    }

}
