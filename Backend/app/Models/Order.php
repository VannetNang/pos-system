<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'payment_method',
        'total_price',
        'sub_total_price',
        'tax_rate',
        'tax_amount'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}