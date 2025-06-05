<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use TCG\Voyager\Traits\Translatable;

class ItemCategory extends Model
{
  use HasFactory ,Translatable;
  
  protected $translatable = ['name', 'description'];

}
