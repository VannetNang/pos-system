<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'imageUrl',
        'stock_quantity'
    ];

    // if using user(), no need to put foreignKey
    // the default is: user_id
    public function creator() {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function carts() {
        return $this->hasMany(Cart::class, 'product_id');
    }
}
