<?php

namespace App\Notifications;

use App\Channels\FirebaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Order;
use Illuminate\Notifications\Notification;

class PushNotification extends Notification
{
    use Queueable;
    
    public  $title;
    public  $message;
    public  $fcmToken;
    public  $data;
    public $from_id;
    public $order;
    public $order_id;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($title, $message, $fcmTokens, $from_id=null, $data = null , $order = null )
    {
        $this->title = $title;
        $this->message = $message;
        $this->fcmToken = $fcmTokens;
        $this->data = $data;
        $this->from_id = $from_id;
        if($order) {
             $getOrder = Order::find($order->id);
             $decode_order = json_encode($getOrder);
             $this->order_id = $order->id;
             $this->order = $decode_order;
        }

    }
    
    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [FirebaseChannel::class];
    }
    
    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     */
    public function toFirebase($notifiable)
    {
        return (new FirebaseChannel())
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }
    
    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
