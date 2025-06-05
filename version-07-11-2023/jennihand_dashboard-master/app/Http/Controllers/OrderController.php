<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use Auth;
use Mail;
use Carbon\Carbon;
use App\Models\Item;
use App\Models\User;
use App\Models\Image;
use App\Models\Order;
use App\Models\Province;
use App\Models\OrderItem;
use App\Mail\OrderDetails;
use App\Models\UserReview;
use Illuminate\Http\Request;
use App\Mail\SubscriptionMail;
use App\Mail\BuyerOrderDetails;
use App\Models\UserSubscriptions;
use Spatie\QueryBuilder\QueryBuilder;
use App\Notifications\PushNotification;
use Illuminate\Support\Facades\Notification;



class OrderController extends Controller
{
    function getProviderOrders()
    {
        request()->validate([
            'title' => 'required'
        ]);

        $user = Auth::user();
        $orders = Order::where('provider_id',  $user->id)->latest();

        $filter = [];

        if (\request()->title === 'Products') {
            $filter = QueryBuilder::for($orders)->allowedFilters('status')->get();
        } else {
            $filter = QueryBuilder::for($orders)->allowedFilters('service_status')->get();
        }

        foreach ($filter as $order) {
            $items = [];
            $provider = User::find($order->provider_id);
            if (\request()->title === 'Products') {
                $items = OrderItem::where('order_id', $order->id)->latest()->get();
                $order->setAttribute('items', $items);
                $order->setAttribute('provider', $provider);
            } else {
                $service = Item::select('items.*', 'media_files.file_path')
                ->join('media_files', 'media_files.item_id', '=', 'items.id')
                ->where('items.id', $order->service_id)
                ->first();
                $images = Image::where('appointment_id', $order->id)->get();
                $order->setAttribute('service', $service);
                $order->setAttribute('images', $images);
                $order->setAttribute('provider', $provider);
            }
        }
        return response()->json($filter);
    }

    function getBuyerOrders()
    {
        request()->validate([
            'title' => 'required'
        ]);
        $user = Auth::user();
        $orders = Order::where('user_id',  $user->id)->latest();

        $filter = [];

        if (\request()->title === 'Products') {
            $filter = QueryBuilder::for($orders)->allowedFilters('status')->get();
        } else {
            $filter = QueryBuilder::for($orders)->allowedFilters('service_status')->get();
        }

        foreach ($filter as $order) {
            $items = [];
            $provider = User::find($order->provider_id);
            if (\request()->title === 'Products') {
                $items = OrderItem::where('order_id', $order->id)->latest()->get();
                $order->setAttribute('items', $items);
                $order->setAttribute('provider', $provider);
            } else {
                $service = Item::select('items.*', 'media_files.file_path')
                    ->join('media_files', 'media_files.item_id', '=', 'items.id')
                    ->where('items.id', $order->service_id)
                    ->first();
                $images = Image::where('appointment_id', $order->id)->get();
                $order->setAttribute('service', $service);
                $order->setAttribute('images', $images);
                $order->setAttribute('provider', $provider);
            }
        }
        return response()->json($filter);
    }

    function ChangeOrderStatus(Order $order)
    {

        if ($order->status === 'Pending') {
            $order->status = 'Confirmed';
            $order->confirmed_at = Carbon::now();
            $order->save();
            $orderStatus = $this->getOrderStatus($order->status);
            $to_user = User::where('id', $order->user_id)->first();
            Notification::send($to_user, new PushNotification("Order Update", "Your order {$order->order_nr} is {$orderStatus}", $to_user->push_token, auth()->id(), null, $order));
            $provider = User::find($order->provider_id);
            $order->setAttribute('provider', $provider);
            return response()->json($order->refresh());
        }
        if ($order->status === 'Confirmed') {
            $order->status = 'onTheWay';
            $order->onDelivery_at = Carbon::now();
            $order->save();
            $orderStatus = $this->getOrderStatus($order->status);
            $to_user = User::where('id', $order->user_id)->first();
            Notification::send($to_user, new PushNotification("Order Update", "Your order {$order->order_nr} is {$orderStatus}", $to_user->push_token, auth()->id(), null, $order));
            $provider = User::find($order->provider_id);
            $order->setAttribute('provider', $provider);
            return response()->json($order->refresh());
        }
        if ($order->status === 'onTheWay') {
            $order->status = 'Delivered';
            $order->is_tracking = 0;
            $order->delivered_at = Carbon::now();
            $order->save();
            $orderStatus = $this->getOrderStatus($order->status);
            $to_user = User::where('id', $order->user_id)->first();
            Notification::send($to_user, new PushNotification("Order Update", "Your order {$order->order_nr} is {$orderStatus}", $to_user->push_token, auth()->id(), null, $order));
            $provider = User::find($order->provider_id);
            $order->setAttribute('provider', $provider);
            return response()->json($order->refresh());
        }
        return response()->json($order->refresh());
    }

    function changeServiceOrderStatus(Order $order)
    {
        if ($order->location !== 'home') {
            if ($order->pickup && $order->delivery) {
                if ($order->service_status === 'Recieved') {
                    $order->service_status = 'Confirmed';
                    $order->confirmed_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'Confirmed') {
                    $order->service_status = 'onTheWayPickUp';
                    $order->onPickup_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'onTheWayPickUp') {
                    $order->service_status = 'InProgress';
                    $order->inProgress_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'InProgress') {
                    $order->service_status = 'ReadyForDelivery';
                    $order->ready_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'ReadyForDelivery') {
                    $order->service_status = 'onTheWayDelivery';
                    $order->onDelivery_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'onTheWayDelivery') {
                    $order->service_status = 'Delivered';
                    $order->is_tracking = 0;
                    $order->delivered_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
            if (!$order->pickup && !$order->delivery) {
                if ($order->service_status === 'Recieved') {
                    $order->service_status = 'Confirmed';
                    $order->confirmed_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'Confirmed') {
                    $order->service_status = 'InProgress';
                    $order->inProgress_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'InProgress') {
                    $order->service_status = 'ReadyForPickUp';
                    $order->pickup_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'ReadyForPickUp') {
                    $order->service_status = 'Delivered';
                    $order->is_tracking = 0;
                    $order->delivered_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order->refresh());
            }
            if ($order->pickup) {
                if ($order->service_status === 'Recieved') {
                    $order->service_status = 'Confirmed';
                    $order->confirmed_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'Confirmed') {
                    $order->service_status = 'onTheWayPickUp';
                    $order->onPickup_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'onTheWayPickUp') {
                    $order->service_status = 'InProgress';
                    $order->inProgress_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'InProgress') {
                    $order->service_status = 'ReadyForPickUp';
                    $order->pickup_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'ReadyForPickUp') {
                    $order->service_status = 'Delivered';
                    $order->is_tracking = 0;
                    $order->delivered_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
            if ($order->delivery) {
                if ($order->service_status === 'Recieved') {
                    $order->service_status = 'Confirmed';
                    $order->confirmed_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'Confirmed') {
                    $order->service_status = 'InProgress';
                    $order->inProgress_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'InProgress') {
                    $order->service_status = 'ReadyForDelivery';
                    $order->ready_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order->refresh());
                }
                if ($order->service_status === 'ReadyForDelivery') {
                    $order->service_status = 'onTheWayDelivery';
                    $order->onDelivery_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                if ($order->service_status === 'onTheWayDelivery') {
                    $order->service_status = 'Delivered';
                    $order->is_tracking = 0;
                    $order->delivered_at = Carbon::now();
                    $order->save();
                    $this->sendOrderNotification($order);
                    $provider = User::find($order->provider_id);
                    $order->setAttribute('provider', $provider);
                    return response()->json($order);
                }
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
        } else {
            if ($order->service_status === 'Recieved') {
                $order->service_status = 'Confirmed';
                $order->confirmed_at = Carbon::now();
                $order->save();
                $this->sendOrderNotification($order);
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order->refresh());
            }
            if ($order->service_status === 'Confirmed') {
                $order->service_status = 'InProgress';
                $order->inProgress_at = Carbon::now();
                $order->save();
                $this->sendOrderNotification($order);
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
            if ($order->service_status === 'InProgress') {
                $order->service_status = 'onTheWay';
                $order->onDelivery_at = Carbon::now();
                $order->save();
                $this->sendOrderNotification($order);
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
            if ($order->service_status === 'onTheWay') {
                $order->service_status = 'Delivered';
                $order->is_tracking = 0;
                $order->delivered_at = Carbon::now();
                $order->save();
                $this->sendOrderNotification($order);
                $provider = User::find($order->provider_id);
                $order->setAttribute('provider', $provider);
                return response()->json($order);
            }
            $provider = User::find($order->provider_id);
            $order->setAttribute('provider', $provider);
            return response()->json($order);
        }
    }

    function extraPaymentRequest(Order $order)
    {
        request()->validate([
            'amount' => "required"
        ]);
        $order->extra_service_fee = request()->amount;
        $order->extra_service_fee_status = 'pending';
        if (request()->discription) {
            $order->payment_discription = request()->discription;
        }
        $provider = User::find($order->provider_id);
        if ($provider && $provider->province_id) {
            $province = Province::find($provider->province_id);
            if ($province) {
                $actualPrice = request()->amount;
                $gstPrice = ($province->gst_tax_percentage / 100) * $actualPrice;
                $pstPrice = ($province->pst_tax_percentage / 100) * $actualPrice;
                $priceWithTaxes = $actualPrice + $gstPrice + $pstPrice;
                $order->extra_service_fee = $priceWithTaxes;
                $order->extra_fee_gst = $gstPrice;
                $order->extra_fee_pst = $pstPrice;
            }
        }
        $order->save();
        $invoice_numbers = [];
        array_push($invoice_numbers, $order->invoice_nr);
        $to_user = User::where('id', $order->user_id)->first();
        if ($order->service_id) {
            $item = Item::find($order->service_id);
            $order->setAttribute('item', $item);
        }
        Notification::send($to_user, new PushNotification("Order Update", "Your order {$order->order_nr} price has been updated , please pay the extra service fees.", $to_user->push_token, auth()->id(), null, $order));
        Mail::to($to_user)->send(new BuyerOrderDetails($order, $to_user, $provider, $invoice_numbers));
        return response()->json($order->refresh());
    }

    function orderDetails(Order $order)
    {
        $review = UserReview::where('order_id', $order->id)->first();
        $order->setAttribute('review', $review);
        $provider = User::find($order->provider_id);
        $order->setAttribute('provider', $provider);
        return response()->json($order);
    }

    function orderTrackingState(Order $order)
    {
        request()->validate([
            'is_tracking' => "required"
        ]);
        if (request()->url) {
            $order->tracking_url = request()->url;
        }
        $order->is_tracking = request()->is_tracking;
        $order->save();
        $response = [
            'order_details' => $order->refresh(),
            'user' => $this->me(auth()->user()->id)
        ];
        return response()->json($response);
    }

    function userUpdateCoords()
    {
        request()->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180'
        ]);

        $user = auth()->user();

        $user->lat = request()->lat;
        $user->lng = request()->lng;
        $user->save();
        return response()->json('success');
    }

    function orderDetailsWithProvider(Order $order)
    {
        $provider = User::find($order->provider_id, ['id', 'lat', 'lng']);
        $review = UserReview::where('order_id', $order->id)->first();
        $order->setAttribute('provider', $provider);
        $order->setAttribute('review', $review);
        return response()->json($order);
    }

    function getProviderLocation(Order $order)
    {
        $provider = User::find($order->provider_id, ['id', 'lat', 'lng']);
        return response()->json($provider);
    }

    function sendOrderNotification($order, $msg = null)
    {
        $to_user = User::where('id', $order->user_id)->first();
        $orderStatus = $this->getOrderStatus($order->service_status);
        $subtitle = $msg ? $msg : "Your order {$order->order_nr} is {$orderStatus}";
        Notification::send($to_user, new PushNotification("Order Update", $subtitle, $to_user->push_token, auth()->id(), null, $order));
    }

    function getOrderStatus($status)
    {
        if ($status === 'onTheWay') {
            return "On the way";
        }
        if ($status === 'InProgress') {
            return "In Progress";
        }

        if ($status === 'ReadyForDelivery') {
            return "Ready for delivery";
        }

        if ($status === 'onTheWayDelivery') {
            return "On the way for delivery";
        }

        if ($status === 'ReadyForPickUp') {
            return "Ready for pick up";
        }

        if ($status === 'onTheWayPickUp') {
            return "On the way to be picked up";
        }

        return $status;
    }

    function sendOrderDetailsMail()
    {
        $cart = \request()->cart;
        $info = \request()->info;
        $invoices = request()->invoices;
        $provider = User::find($cart['provider_id']);
        Mail::to($info['email'])->send(new BuyerOrderDetails($cart, $info, $invoices, $provider));
        Mail::to($provider->email)->send(new BuyerOrderDetails($cart, $info, $invoices, $provider));
    }

    function sendSubscriptionDetailsMail()
    {
        request()->validate([
            'package_id' => "required",
            'invoice' => "required",
        ]);

        $package = UserSubscriptions::find(request()->package_id);
        $invoice = request()->invoice;
        $user = auth()->user();
        $province = Province::where('name', 'QC')->first();
        Mail::to($user)->send(new SubscriptionMail($package, $invoice, $user, $province));
    }
}
