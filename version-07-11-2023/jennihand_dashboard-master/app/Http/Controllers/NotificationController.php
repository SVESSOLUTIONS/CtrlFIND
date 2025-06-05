<?php

namespace App\Http\Controllers;

use TCG\Voyager\Facades\Voyager;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $lang = request()->lang;
        $user = Auth::user();
        $notifications = Notification::where('to_id', $user->id)
            ->where('is_read',false)
            ->orderBy('created_at', 'DESC')
            ->paginate(15);
        if (!empty($lang) && $lang === "fr") {
            foreach ($notifications as $key => $notification) {

                $orderNumber = $notification->order_id;
                $paddingLength = 8 - strlen($orderNumber);
                $padding = str_repeat('0', $paddingLength);
                $orderNumber = "#".$padding.$orderNumber;

                if ($notification->title === "Order Cancelled") {
                    $message = trans('notification.order_cancelled', ['order_number' => $orderNumber], $lang);
                }
                elseif ($notification->title === "Your order $orderNumber has been declined."){
                        $message = trans('notification.order_declined', ['order_number' => $orderNumber], $lang);
                } else {
                    switch ($notification->message) {
                        case "You have a new order $orderNumber":
                            $message = trans('notification.new_order_notification', ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is On the way":
                            $message = trans('notification.order_on_the_way_notification', ['order_number' => $orderNumber], $lang);
                            break;
                            case "The order $orderNumber has been cancelled.":
//                            case "Your order $orderNumber is On the way":
                            $message = trans('notification.order_cancelled', ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is confirmed.":
                            $message = trans('notification.order_confirmed_notification', ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is In Progress":
                            $message = trans('notification.order_in_progress_notification', ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is Delivered":
                            $message = trans("notification.order_delivered_notification", ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is Ready for delivery":
                            $message = trans("notification.order_ready_for_delivered_notification", ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is On the way for delivery":
                            $message = trans("notification.onder_way_to_delivery", ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber is On the way to be picked up":
                            $message = trans("notification.onder_way_to_pickup", ['order_number' => $orderNumber], $lang);
                            break;
                        case "Your order $orderNumber price has been updated, please pay the extra service fees.":
                            $message = trans('notification.order_price_updated', ['order_number' => $orderNumber], $lang);
                            break;
                        case "order $orderNumber Amount paid.":
                            $message = trans('notification.order_amount_paid', ['order_number' => $orderNumber], $lang);
                            break;
                        default:
                            $message = $notification->message;
                            break;
                    }
                }
                $notification->message = str_replace('##', '#', $message);
            }
        }

        return response()->json($notifications);
    }

    public function markRead($id)
    {
        try {
            $user = Auth::user();
            $notification = Notification::where('id', $id)->where('to_id', $user->id)->firstOrFail();
            $notification->is_read = true;
            $notification->save();
        }catch (\Exception $e){
            return response()->json(['message'=>'Notification not found'],404);
        }
    }
}
