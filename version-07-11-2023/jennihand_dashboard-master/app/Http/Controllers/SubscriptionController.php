<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\UserSubscriptions;
use App\Models\Payment;
use Carbon\Carbon;
use Auth;


class SubscriptionController extends Controller
{
    function getPackages()
    {
        
        $packages = Subscription::where('is_restricted',false)->latest()->get();
        $usersSpecific = Subscription::where('is_restricted',true)
            ->join('subscription_for_users as sfu',function($join){
                $join->on('subscriptions.id','=','sfu.subscription_id')
                    ->where('sfu.user_id','=',\Illuminate\Support\Facades\Auth::id());
            })->latest()->select('subscriptions.*')->get();
        $packages = $usersSpecific->merge($packages);
        return response()->json(['packages' => $packages] , 200);

    }

    function subscribePackage(Subscription $subscription) {
        request()->validate([
            'sub_total' => 'required',
            'gst' => 'required',
            'pst' => 'required',
            'price' => 'required'
        ]);
        $user = Auth::user();
        UserSubscriptions::where('user_id' ,$user->id)->update(['status' => "INACTIVE"]);
        $package = new UserSubscriptions();
        $package->user_id = $user->id;
        $package->subscription_id = $subscription->id;
        $package->purchase_date = Carbon::now();
        $package->gst = request()->gst;
        $package->pst = request()->pst;
        $package->sub_total = request()->sub_total;
        $package->price = request()->price;
        $package->remarks = " ";
        $package->status = "ACTIVE";
        $package->expires_at = Carbon::now()->addDays($subscription->expiry);
        if($package->save()) {
          $payment =  Payment::create([
                'buyer_id' => 0,
                'invoice_nr' =>  "SUB" . random_int(100000, 999999),
                'provider_id' => $user->id,
                'subscription_id' => $subscription->id,
                'service_type' => "subscription",
                'amount' => $subscription->price,
            ]);
            $user =  $this->me($user->id);
            $data = [
             "user" => $user, 
             "invoice" => $payment->invoice_nr,
             "package_id" => $package->id,
            ];
            return response()->json($data, 200);
        }
        
     
    }

}
