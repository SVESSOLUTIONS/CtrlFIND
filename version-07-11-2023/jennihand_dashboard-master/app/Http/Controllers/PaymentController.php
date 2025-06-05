<?php

namespace App\Http\Controllers;

use Session;
use Carbon\Carbon;
use Stripe\Charge;
use Stripe\Stripe;
use App\Models\Item;
use App\Models\User;
use Stripe\Customer;
use App\Models\Image;
use App\Models\Order;
use App\Models\Service;
use App\Models\Payment;
use App\Models\Province;
use App\Models\Schedule;
use App\Models\OrderItem;
use Stripe\PaymentIntent;
use App\Models\Appointment;
use Illuminate\Support\Str;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Mail\BuyerOrderDetails;
use App\Models\UserSubscriptions;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Notifications\PushNotification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Models\Notification as NotificationModel;


class PaymentController extends Controller
{

    function orderWithCod()
    {
        request()->validate([
            'cart' => 'required',
            'info' => 'required',
        ]);

        $user = auth()->user();
        $order = new Order();
        $order->order_nr = $this->generateOrderNR();
        $order->user_id = $user->id;
        $order->provider_id = request()->cart['provider_id'];
        $order->provider_name = request()->cart['provider_name'];
        $order->buyer_name = $user->name;
        $order->amount = request()->cart['total_price'];
        $order->name = request()->info['name'];
        $order->email = request()->info['email'];
        $order->phone = request()->info['phone'];
        $order->delivery_type = request()->info['delivery_type'];
        $order->delivery_address = request()->info['delivery_address_value'];
        $order->payment_type = 'COD';
        if (request()->info['delivery_address_label']) {
            $order->delivery_address_label = request()->info['delivery_address_label'];
        }
        if (request()->info['lat'] && request()->info['lng']) {
            $order->lat = request()->info['lat'];
            $order->lng = request()->info['lng'];
        }

        $items_encoded = json_encode(request()->cart['items']);

        $items = json_decode($items_encoded);

        if ($order->save()) {
            foreach ($items as  $item) {
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->item_id = $item->id;
                $orderItem->name = $item->name;
                $orderItem->qty = $item->qty;
                $orderItem->price = $item->price;
                if ($item->size) {
                    $orderItem->size = $item->size;
                }
                if ($item->color) {
                    $orderItem->color = $item->color;
                }
                if ($item->img) {
                    $orderItem->img = $item->img;
                }
                $orderItem->save();
            }
        }

        return response()->json($order);
    }

    function getStripeKey()
    {
        $stripe_public_key = "pk_live_51JkSsTJV3eQsFOFwipzHci24EaXjnbRm3zqVh7HlZgSsK3quLQEij8LHMZdfZ0dU3tVKFWgQBq7H6MBUef7XUC3000YHmlwdre";
        return  response()->json($stripe_public_key);
    }

    function getClientSecret()
    {
        request()->validate([
            'amount' => 'required',
        ]);
        $stripe =  new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $intent = $stripe->paymentIntents->create([
            'amount' => request()->amount * 100,
            'currency' => 'cad',
        ]);
        $client_secret = $intent->client_secret;
        return response()->json($client_secret);
    }


    public function checkout(Request $request)
    {
        request()->validate([
            'cart' => 'required',
            'info' => 'required',
        ]);


        $user = auth()->user();

        $items_encoded = json_encode(request()->cart['items']);

        $items = json_decode($items_encoded);

        $collection = collect($items);

        $order_ids = [];
        $service_ids = [];
        $order_numbers = [];
        $invoice_numbers = [];

        $message = null;

        $products = $collection->filter(function ($item, $key) {
            return $item->order_type === 'product';
        })->values();


        $services = $collection->filter(function ($item, $key) {
            return $item->order_type === 'service';
        })->values();

        $products_total_amount = $products->reduce(function ($carry, $item) {
            return $carry + $item->price;
        });


        if (!$services->isEmpty()) {

            foreach ($services as  $service) {

                $commission = $this->getCommission($user->id, $service->price);
                $order_total = $service->price;

                $order = new Order();
                $order->order_nr = $this->generateOrderNR();
                $order->user_id = $user->id;
                $order->provider_id = request()->cart['provider_id'];
                $order->provider_name = request()->cart['provider_name'];
                $order->buyer_name = $user->name;
                $order->amount = $order_total;
                $order->commission = $commission;
                $order->name = request()->info['name'];
                $order->email = request()->info['email'];
                $order->phone = request()->info['phone'];
                $order->delivery_type = '';
                $order->delivery_address = $service->address;
                $order->payment_type = 'CARD';
                $order->service_id = $service->id;
                $order->appointment_date = $service->appointment_date;
                $order->pickup = $service->pickup;
                $order->delivery = $service->delivery;
                $order->information = $service->information;
                $order->order_type = 'service';
                if ($service->sub_total) {
                    // $order->sub_total = number_format($service->sub_total, 2);
                    $order->sub_total = $service->sub_total;
                }
                if ($service->discount) {
                    // $order->discount = number_format($service->discount, 2);
                    $order->discount = $service->discount;
                }
                if ($service->gst) {
                    // $order->gst = number_format($service->gst, 2);
                    $order->gst = $service->gst;
                }
                if ($service->pst) {
                    $order->pst = $service->pst;
                }
                if ($service->location) {
                    $order->location = $service->location;
                }
                if ($service->address_label) {
                    $order->delivery_address_label = $service->address_label;
                }

                if (request()->cart['type']) {
                    $order->type = request()->cart['type'];
                }


                if ($service->lat && $service->lng) {
                    $order->lat = $service->lat;
                    $order->lng = $service->lng;
                }

                $order->require_appointment = $service->require_appointment;

                if ($service->require_appointment === 'Y') {
                    $schedule = Schedule::find($service->schedule_id);
                    $order->schedule_id = $service->schedule_id;
                    $encoded_slots_data = json_encode($service->appointment_time);
                    $slots_data = json_decode($encoded_slots_data);
                    $slots = count($slots_data);
                    $order->appointment_time = $encoded_slots_data;
                    if ($schedule->availible_slots >= $slots) {
                        $order->total_slots = $slots;
                        $schedule->availible_slots -= $slots;
                        $schedule->booked_slots += $slots;
                        if ($schedule->slots_data) {
                            $decodedSlots = json_decode($schedule->slots_data);
                            $filtered = collect($decodedSlots)->map(function ($value) use ($slots_data) {

                                if (in_array($value, $slots_data)) {
                                    return 'BOOKED';
                                } else {
                                    return $value;
                                }
                            });
                            $encodedSlots = json_encode($filtered);
                            $schedule->slots_data = $encodedSlots;
                        }
                        $schedule->save();
                    } else {
                        $message = 'There are currently no appointment available for ' . $service->name;
                    }
                }

                if ($order->amount == 0) {
                    $order->payment_status = 'paid';
                    $order->gst = 0;
                    $order->pst = 0;
                }
                if ($order->save()) {
                    $images_encoded = json_encode($service->images);
                    $images = json_decode($images_encoded);
                    array_push($order_ids, $order->id);
                    array_push($service_ids, $service->id);

                    if ($images) {
                        foreach ($images as $image) {
                            $save_path = $this->makeImage($image->uri);
                            $media = new Image();
                            $media->appointment_id = $order->id;
                            $media->file_path = $save_path;
                            $media->save();
                        }
                    }

                    /*@todo Change to user to user to send notification*/
                    try {
                        $to_user = User::where('id', $order->provider_id)->first();
                        Notification::send($to_user, new PushNotification("New Order", "You have a new order {$order->order_nr}", $to_user->push_token, auth()->id(), null, $order));
                    } catch (\Exception $e) {
                        Log::error($e->getMessage());
                    }
                }
            }
        }



        // Products

        if (!$products->isEmpty()) {

            $commission = $this->getCommission($user->id, $products_total_amount);

            $order_total = $products_total_amount;

            $order = new Order();
            $order->order_nr = $this->generateOrderNR();
            $order->user_id = $user->id;
            $order->provider_id = request()->cart['provider_id'];
            $order->provider_name = request()->cart['provider_name'];
            $order->buyer_name = $user->name;
            $order->amount = $order_total;
            $order->commission = $commission;
            $order->name = request()->info['name'];
            $order->email = request()->info['email'];
            $order->phone = request()->info['phone'];
            $order->delivery_type = request()->info['delivery_type'];
            $order->delivery_address = request()->info['delivery_address_value'];
            $order->payment_type = 'CARD';
            if (request()->info['delivery_address_label']) {
                $order->delivery_address_label = request()->info['delivery_address_label'];
            }
            if (request()->info['lat'] && request()->info['lng']) {
                $order->lat = request()->info['lat'];
                $order->lng = request()->info['lng'];
            }

            $products_total_discount = $products->reduce(function ($carry, $item) {
                return $carry + ($item->discount * $item->qty);
            });

            $products_sub_total =  $products->reduce(function ($carry, $item) {
                return $carry + ($item->sub_total * $item->qty);
            });

            $products_gst = $products->reduce(function ($carry, $item) {
                return $carry + ($item->gst * $item->qty);
            });

            $products_pst = $products->reduce(function ($carry, $item) {
                return $carry + ($item->pst * $item->qty);
            });


            $products_amount = $products->reduce(function ($carry, $item) {
                return $carry + ($item->price * $item->qty);
            });


            $order->discount = $products_total_discount;

            $order->sub_total = $products_sub_total;

            $order->gst = $products_gst;

            $order->pst = $products_pst;

            $order->amount = $products_amount;



            if (request()->cart['type']) {
                $order->type = request()->cart['type'];
            }

            if ($order->save()) {
                foreach ($products as  $item) {
                    $orderItem = new OrderItem();
                    $orderItem->order_id = $order->id;
                    $orderItem->item_id = $item->id;
                    $orderItem->name = $item->name;
                    $orderItem->qty = $item->qty;
                    $orderItem->price = $item->price;
                    if ($item->size) {
                        $orderItem->size = $item->size;
                    }
                    if ($item->color) {
                        $orderItem->color = $item->color;
                    }
                    if ($item->img) {
                        $orderItem->img = $item->img;
                    }
                    if ($item->sub_total) {
                        $orderItem->sub_total = $item->sub_total;
                    }
                    if ($item->discount) {
                        $orderItem->discount = $item->discount;
                    }
                    if ($item->gst) {
                        $orderItem->gst = $item->gst;
                    }
                    if ($item->pst) {
                        $orderItem->pst = $item->pst;
                    }
                    $orderItem->save();
                }
            }


            /*@todo Change to user to user to send notification*/
            try {
                $to_user = User::where('id', $order->provider_id)->first();
                Notification::send($to_user, new PushNotification("New Order", "You have a new order {$order->order_nr}", $to_user->push_token, auth()->id(), null, $order));
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }

        return response()->json($responseData = [
            'payment_type' => 'CARD',
            'amount' => request()->cart['total_price'],
            'message' => $message,
            'order_nr' => $order_numbers,
            'invoice_nr' => $invoice_numbers,
            'order_ids' => $order_ids,
            'service_ids' => $service_ids,
        ]);
    }


    function confirmOrder(Order $order)
    {
        if ($order->payment_status === 'pending') {
            if ($order->amount == 0) {
                $order->payment_status = 'paid';
                $order->gst = 0;
                $order->pst = 0;
            }else{
                $order->payment_status = 'confirmed';
            }

            if ($order->save()) {
                $decode_order = json_encode($order);
                NotificationModel::where('order_id', $order->id)->update(['order' => $decode_order]);
                try {
                    $to_user = User::where('id', $order->user_id)->first();
                    Notification::send($to_user, new PushNotification("Order Confirmed", "Your order {$order->order_nr} is confirmed.", $to_user->push_token, auth()->id(), null, $order));
                } catch (\Exception $e) {
                    Log::error($e->getMessage());
                }
                if ($order->service_id != null) {
                    $service = Service::find($order->service_id);
                    $order['service'] = $service;
                 }
                return response()->json($order);
            }
        } else return response()->json(null, 400);
    }

    function declineOrder(Order $order)
    {
        request()->validate(['note' => 'required']);

        if ($order->order_type === 'service') {
            if ($order->service_status === 'Recieved') {
                $order->service_status = 'Decline';
                // find schedule and put slots back into
                $schedule = Schedule::find($order->schedule_id);
                $ordered_slots_data = json_decode($order->appointment_time);
                $ordered_slots = count($ordered_slots_data);

                $schedule->availible_slots += $ordered_slots;
                $schedule->booked_slots -= $ordered_slots;
                $schedule_slots_data = json_decode($schedule->slots_data);
                $count = 0;
                foreach ($schedule_slots_data as $key => $slot) {
                    if ($count >= $ordered_slots)
                        break;
                    if ($slot == 'BOOKED') {
                        $schedule_slots_data[$key] = $ordered_slots_data[$count];
                        $count++;
                    }
                }
                $schedule->slots_data = json_encode($schedule_slots_data);
                $schedule->save();
                $order->appointment_time = null;
                $order->total_slots = 0;
            } else return response()->json(null, 400);
        } else {
            if ($order->status === 'Pending') {
                $order->status = 'Decline';
            } else return response()->json(null, 400);
        }
        $order->note = request()->note;
        if ($order->save()) {
            $decode_order = json_encode($order);
            NotificationModel::where('order_id', $order->id)->update(['order' => $decode_order]);
            try {
                $to_user = User::where('id', $order->user_id)->first();
                Notification::send($to_user, new PushNotification("Your order {$order->order_nr} has been declined.", request()->note, $to_user->push_token, auth()->id(), null, $order));
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
            return response()->json($order);
        } else return response()->json(null, 400);
    }

    function cancelOrder(Order $order)
    {
        if ($order->order_type === 'service') {
            if ($order->service_status === 'Recieved') {
                $order->service_status = 'Cancelled';
                // find schedule and put slots back into
                $schedule = Schedule::find($order->schedule_id);
                $ordered_slots_data = json_decode($order->appointment_time);
                $ordered_slots = count($ordered_slots_data);

                $schedule->availible_slots += $ordered_slots;
                $schedule->booked_slots -= $ordered_slots;
                $schedule_slots_data = json_decode($schedule->slots_data);
                $count = 0;
                foreach ($schedule_slots_data as $key => $slot) {
                    if ($count >= $ordered_slots)
                        break;
                    if ($slot == 'BOOKED') {
                        $schedule_slots_data[$key] = $ordered_slots_data[$count];
                        $count++;
                    }
                }
                $schedule->slots_data = json_encode($schedule_slots_data);
                $schedule->save();
                $order->appointment_time = null;
                $order->total_slots = 0;
            } else return response()->json(null, 400);
        } else {
            if ($order->status === 'Pending') {
                $order->status = 'Cancelled';
            } else return response()->json(null, 400);
        }

        if ($order->save()) {
            $decode_order = json_encode($order);
            NotificationModel::where('order_id', $order->id)->update(['order' => $decode_order]);
            try {
                $to_user = User::where('id', $order->user_id)->first();
                Notification::send($to_user, new PushNotification("Order Cancelled", "The order {$order->order_nr} has been cancelled.", $to_user->push_token, auth()->id(), null, $order));
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
            return response()->json($order);
        } else return response()->json(null, 400);
    }




    function orderPayment(Order $order)
    {
        $order_numbers = [];
        $invoice_numbers = [];

        $invoice_nr = $this->generateInvoiceNR();

        $order_total = $order->amount - $order->commission;

        if ($order->order_type === 'service') {
            Payment::create([
                'buyer_id' => $order->user_id,
                'invoice_nr' => $invoice_nr,
                'provider_id' => $order->provider_id,
                'appointment_id' => $order->id,
                'order_id' => $order->id,
                'service_type' => "appointment",
                'amount' => $order_total,
            ]);

            if ($order->commission > 0) {
                Payment::create([
                    'buyer_id' => $order->user_id,
                    'invoice_nr' => $invoice_nr,
                    'provider_id' => $order->provider_id,
                    'order_id' => $order->id,
                    'service_type' => "commission",
                    'amount' => $order->commission,
                ]);
            }
        } else {
            Payment::create([
                'buyer_id' => $order->user_id,
                'invoice_nr' => $invoice_nr,
                'provider_id' => $order->provider_id,
                'order_id' => $order->id,
                'amount' => $order_total,
            ]);

            if ($order->commission > 0) {
                Payment::create([
                    'buyer_id' => $order->user_id,
                    'invoice_nr' => $invoice_nr,
                    'provider_id' => $order->provider_id,
                    'order_id' => $order->id,
                    'service_type' => "commission",
                    'amount' => $order->commission,

                ]);
            }
        }

        $order->invoice_nr = $invoice_nr;
        $order->payment_status = 'paid';
        if ($order->order_type === 'service') {
            $order->service_status = 'Confirmed';
        }else {
            $order->status = 'Confirmed';
        }
        $order->confirmed_at = Carbon::now();

        if ($order->save()) {
            array_push($order_numbers, $order->order_nr);
            array_push($invoice_numbers, $order->invoice_nr);
            $decode_order = json_encode($order);
            NotificationModel::where('order_id', $order->id)->update(['order' => $decode_order]);
            $provider = $this->me($order->provider_id);
            $buyer = User::find($order->user_id);
            $items = OrderItem::where('order_id', $order->id)->get();
            if ($order->service_id) {
                $item = Item::find($order->service_id);
                $order->setAttribute('item', $item);
            }
            $order->setAttribute('items', $items);
            if ($order_total > 0)
            {
                $address = $buyer->address_home;
                $province = $this->getStateFromAddress($address);
                $gstPercentage = 0;
                $pstPercentage = 0;

                if ($province) {
                    $p = Province::whereRaw( 'UPPER(`name`) LIKE ?', [ $province ] )->first();
                    if ($p) {
                        $gstPercentage = $p->gst_tax_percentage;
                        $pstPercentage = $p->pst_tax_percentage;
                    }
                }

                Mail::to($buyer)->send(new BuyerOrderDetails($order, $buyer, $provider, $invoice_numbers,null,$gstPercentage,$pstPercentage));
                Mail::to($provider)->send(new BuyerOrderDetails($order, $buyer, $provider, $invoice_numbers,null,$gstPercentage,$pstPercentage));
            }
            return response()->json($responseData = [
                'payment_type' => 'CARD',
                'amount' => $order->amount,
                'order_nr' => $order_numbers,
                'invoice_nr' => $invoice_numbers,
                'gst' => $order->gst,
                'pst' => $order->pst
            ]);
        }
    }

    function getStateFromAddress($address) {
        $pattern = '/\b([A-Z]{2})\b/';
        if (preg_match($pattern, $address, $matches)) {
            return $matches[1];
        } else {
            return null;
        }
    }

    function getPaymentsHistory()
    {
        $user = auth()->user();
        $payments = [];
        if ($user->role === 2) {
            $payments = Payment::where('buyer_id', $user->id)->latest()->get();
        } else {
            $payments = Payment::where('provider_id', $user->id)->latest()->get();
            foreach ($payments as $payment) {
                $item = null;
                $buyer = User::find($payment->buyer_id, ['id', 'avatar', 'name']);
                if ($payment->service_type === 'order') {
                    $orderItem = null;
                    $item = Order::find($payment->order_id, ['id',
                     'service_id', 'order_nr' ,
                     'gst' , 'pst' , 'amount' ,
                     'sub_total' , 'discount', 'extra_service_fee' ]);
                    if ($item) {
                        $orderItem = OrderItem::where('order_id', $item->id)->first();
                        if ($orderItem) {
                            $item->setAttribute('name',  $orderItem['name']);
                        }
                    }
                    $payment->setAttribute('type', 'received');
                }
                if ($payment->service_type === 'appointment') {
                    $orderItem = null;
                    $item = null;
                    if ($payment->appointment_id) {
                        $item = Order::find($payment->appointment_id, ['id',
                     'service_id', 'order_nr' ,
                     'gst' , 'pst' , 'amount' ,
                     'sub_total' , 'discount', 'extra_service_fee']);
                    } else {
                        $item = Order::find($payment->order_id, ['id',
                     'service_id', 'order_nr' ,
                     'gst' , 'pst' , 'amount' ,
                     'sub_total' , 'discount', 'extra_service_fee']);
                    }
                    if ($item) {
                        $orderItem = Item::find($item->service_id);
                        if ($orderItem) {
                            $item->setAttribute('name', $orderItem['title']);
                        }
                    }
                    $payment->setAttribute('type', 'received');
                }
                if ($payment->service_type === 'subscription') {
                    $item = Subscription::find($payment->subscription_id, ['id', 'name']);
                    $payment->setAttribute('type', 'pay');
                }
                $payment->setAttribute('user', $buyer);
                $payment->setAttribute('item', $item);
            }
        }
        return response()->json($payments);
    }

    public function extraPaymentPaid(Order $order)
    {
        $order->extra_service_fee_status = 'paid';
        $invoice_numbers = [];
        if($order->save()) {
            $decode_order = json_encode($order);
            NotificationModel::where('order_id', $order->id)->update(['order' => $decode_order]);
            $to_user = User::where('id', $order->provider_id)->first();
            if ($to_user) {
                array_push($invoice_numbers, $order->invoice_nr);
                $provider = $this->me($order->provider_id);
                $buyer = User::find($order->user_id);
                $items = OrderItem::where('order_id', $order->id)->get();
                if ($order->service_id) {
                    $item = Item::find($order->service_id);
                    $order->setAttribute('item', $item);
                }
                $order->setAttribute('items', $items);
                // return $order;
                Mail::to($buyer)->send(new BuyerOrderDetails($order, $buyer, $provider, $invoice_numbers, 'extra_service_fee'));
                Mail::to($provider)->send(new BuyerOrderDetails($order, $buyer, $provider, $invoice_numbers, 'extra_service_fee'));

                Notification::send($to_user, new PushNotification("Order update", "order {$order->order_nr} Amount paid.", $to_user->push_token, auth()->id(), null, $order));
            }
            return response()->json($order->refresh());
        }

    }

    public function generateInvoiceNR()
    {
        $orderObj = Order::whereNotNull('invoice_nr')->select('invoice_nr')->latest('id')->first();
        if ($orderObj) {
            $invoice_nr = $orderObj->invoice_nr;
            $explod = explode("CTRL", $invoice_nr);
            $removed1char = substr($explod[1], 1);
            $generateOrder_nr = $stpad = 'CTRL' . str_pad($removed1char + 1, 5, "0", STR_PAD_LEFT);
        } else {
            $generateOrder_nr = 'CTRL' . str_pad(1, 5, "0", STR_PAD_LEFT);
        }
        return $generateOrder_nr;
    }

    public function generateOrderNR()
    {
        $orderObj = Order::select('order_nr')->latest('id')->first();
        if ($orderObj) {
            $orderNr = $orderObj->order_nr;
            $removed1char = substr($orderNr, 1);
            $generateOrder_nr = $stpad = '#' . str_pad($removed1char + 1, 8, "0", STR_PAD_LEFT);
        } else {
            $generateOrder_nr = '#' . str_pad(1, 8, "0", STR_PAD_LEFT);
        }
        return $generateOrder_nr;
    }

    private function getCommission($user_id, $total_price)
    {
        $package = UserSubscriptions::whereUserId($user_id)
            ->join('subscriptions', 'user_subscriptions.subscription_id', '=', 'subscriptions.id')
            ->whereStatus('ACTIVE')
            ->first();
        $commission = 0;
        if (!empty($package)) {
            if ($package->commission > 0) {
                $commission = ($total_price * $package->commission) / 100;
            }
        }
        return $commission;
    }

    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "appointments/images/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }

    function getProvince()
    {
        $province = Province::where('name', 'QC')->first();
        return response()->json($province);
    }
}
