<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SubscriptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $package;
    public $subscription;
    public $invoice;
    public $user;
    public $province;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($package , $invoice , $user , $province)
    {
        $this->package = $package;
        $this->invoice = $invoice;
        $this->user = $user;
        $this->province = $province;
        $this->subscription = Subscription::find($package->subscription_id);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.subscription');
    }
}
