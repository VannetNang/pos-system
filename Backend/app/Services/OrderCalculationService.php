<?php

namespace App\Services;

class OrderCalculationService
{
    public function calculation($cartItems) {
        // per % rate  (tax = 10%)
        $taxRate = 10;
        $taxAmount = $taxRate / 100;
        
        // calculate total price with quantity   (no tax)
        $subTotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // calculate total price to pay   (with tax)
        $totalWithoutTax = $subTotal * $taxAmount;
        $total = $subTotal + $totalWithoutTax;

        return [
            'taxRate' => $taxRate,
            'taxAmount' => $taxAmount,
            'subTotal' => $subTotal,
            'total' => $total,
        ];
    }
}
