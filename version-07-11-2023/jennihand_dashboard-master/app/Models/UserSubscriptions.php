<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mvdnbrk\EloquentExpirable\Expirable;


class UserSubscriptions extends Model
{
    use HasFactory , Expirable;

     /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    
    protected $guarded = [];

   
}
