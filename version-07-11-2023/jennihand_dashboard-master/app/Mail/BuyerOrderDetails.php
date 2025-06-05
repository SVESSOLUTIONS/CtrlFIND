<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BuyerOrderDetails extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $buyer;
    public $provider;
    public $invoices;
    public $status;
    public $gst;
    public $pst;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($order , $buyer , $provider , $invoices, $status=null,$gst=null,$pst=null)
    {

        $this->order = $order;
        $this->buyer = $buyer;
        $this->provider = $provider;
        $this->invoices = $invoices;
        $this->status = $status;
        $this->gst = $gst;
        $this->pst = $pst;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.buyerOrders');
    }
}
