<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // function for calculation (total, subTotal, taxRate, taxAmount)
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
            $taxRate, 
            $taxAmount, 
            $subTotal, 
            $total
        ];
    }

    // render all completed payment in DB
    public function index() {
        $orders = Order::where('status', 'completed')
                        ->with('user')
                        ->with('products:id,name,price,stock_quantity,imageUrl')
                        ->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'There are no orders.',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Order summary retrieved successfully.',
            'data' => [
                'order' => $orders
            ]
        ], 200);
    } 

    // generate checkout summary data (total, subTotal, taxRate, taxAmount)
    // and items that we order
    public function orderSummary(Request $request) {
        $cartItems = Cart::where('user_id', $request->user()->id)
                        ->with('product')
                        ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'There are no products in cart.'
            ], 404);
        }

        $items = $cartItems->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_price' => $item->product->price,
                'product_quantity' => $item->quantity,
                'product_subTotal' => $item->product->price * $item->quantity 
            ];
        });

        [$taxRate, $taxAmount, $subTotal, $total] = $this->calculation($cartItems);

        return response()->json([
            'status' => 'success',
            'message' => 'Order summary retrieved successfully.',
            'data' => [
                'items' => $items,
                'total' => $total,
                'subTotal' => $subTotal,
                'taxRate' => $taxRate,
                'taxAmount' => $taxAmount
            ]
        ], 200);
    }

    // payment method = cash
    public function cashCheckout(Request $request){
    $request->validate([
        'payment_method' => ['required', 'in:cash']
    ]);

    try {
        $order = DB::transaction(function () use ($request) {

            $cartItems = Cart::where('user_id', $request->user()->id)
                ->with(['product' => function ($query) {
                    // lock the product cause it contains stock quantity
                    // it makes sure: users can't checkout the same product at the same time
                    // else: it will cause overselling (stock_quantity = -1) 
                    $query->lockForUpdate();
                }])
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('CART_EMPTY');
            }

            // check stock quantity
            foreach ($cartItems as $item) {
                if ($item->quantity > $item->product->stock_quantity) {
                    throw new \Exception(
                        "INSUFFICIENT_STOCK|{$item->product->name}|{$item->product->stock_quantity}"
                    );
                }
            }

            [$taxRate, $taxAmount, $subTotal, $total] =
                $this->calculation($cartItems);

            $order = Order::create([
                'user_id' => $request->user()->id,
                'payment_method' => 'cash',
                'status' => 'completed',
                'total_price' => $total,
                'sub_total_price' => $subTotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount
            ]);

            // attach data to order_product table
            foreach ($cartItems as $item) {
                $order->products()->attach($item->product_id, [
                    'quantity' => $item->quantity,
                    'price_at_sale' => $item->product->price
                ]);

                // decrease the quantity from products DB
                $item->product->decrement('stock_quantity',$item->quantity);
            }

            // clear cart
            Cart::where('user_id', $request->user()->id)->delete();

            return $order;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Cash checkout completed successfully.',
            'data' => [
                'order' => $order->load(
                    'products:id,name,price,stock_quantity,imageUrl'
                )
            ]
        ], 201);

    } catch (\Exception $e) {

        if ($e->getMessage() === 'CART_EMPTY') {
            return response()->json([
                'status' => 'error',
                'message' => 'There are no products in cart.'
            ], 404);
        }

        if (str_starts_with($e->getMessage(), 'INSUFFICIENT_STOCK')) {
            [, $productName, $availableStock] = explode('|', $e->getMessage());

            return response()->json([
                'status' => 'error',
                'code' => 'INSUFFICIENT_STOCK',
                'message' => 'Not enough stock for one or more products.',
                'data' => [
                    'product_name' => $productName,
                    'available_stock' => $availableStock,
                ],
            ], 400);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Checkout failed.'
        ], 500);
    }
}

}
