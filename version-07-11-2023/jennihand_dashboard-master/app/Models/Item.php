<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use TCG\Voyager\Traits\Translatable;
use App\Models\ItemReview;

class Item extends Model
{
    use HasFactory;
    use Translatable;
    protected $translatable = ['title', 'discription', 'summary'];

    protected $guarded = [];


    function scopeProductScope($query) {
        return $query->where('item_type', 'product');
    }

    function scopeServiceScope($query) {
        return $query->where('item_type', 'service');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'item_tags', 'item_id', 'tag_id');
    }

    public function reviews()
    {
        return $this->hasMany(ItemReview::class);
    }
}
