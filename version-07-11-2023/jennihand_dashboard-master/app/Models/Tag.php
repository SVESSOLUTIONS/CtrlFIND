<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function items()
    {
       return $this->belongsToMany(Item::class, 'item_tags', 'tag_id' , 'item_id');
    }

}
