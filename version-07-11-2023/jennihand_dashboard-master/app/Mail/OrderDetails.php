<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderDetails extends Mailable
{
    use Queueable, SerializesModels;

    public $cart;
    public $info;
    public $invoices;
    public $provider;


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($cart , $info , $invoices , $provider)
    {
        $this->cart = $cart;
        $this->info = $info;
        $this->invoices = $invoices;
        $this->provider = $provider;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.orders');
    }
}
