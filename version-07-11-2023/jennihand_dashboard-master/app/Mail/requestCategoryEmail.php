<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class requestCategoryEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $category_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name , $category_name)
    {
        $this->name = $name;
        $this->category_name = $category_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.requestCategory');
    }
}
