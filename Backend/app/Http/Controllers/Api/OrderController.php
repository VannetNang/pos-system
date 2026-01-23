<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Services\OrderCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
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
    public function orderSummary(Request $request, OrderCalculationService $calculator) {
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

        $calculation = $calculator->calculation($cartItems);

        return response()->json([
            'status' => 'success',
            'message' => 'Order summary retrieved successfully.',
            'data' => [
                'items' => $items,
                'total' => $calculation['total'],
                'subTotal' => $calculation['subTotal'],
                'taxRate' => $calculation['taxRate'],
                'taxAmount' => $calculation['taxAmount']
            ]
        ], 200);
    }

    // payment method = cash
    public function cashCheckout(Request $request, OrderCalculationService $calculator){
        $request->validate([
            'payment_method' => ['required', 'in:cash']
        ]);

        try {
            $order = DB::transaction(function () use ($request, $calculator) {

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

                $calculation = $calculator->calculation($cartItems);

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'payment_method' => 'cash',
                    'status' => 'completed',
                    'total_price' => $calculation['total'],
                    'sub_total_price' => $calculation['subTotal'],
                    'tax_rate' => $calculation['taxRate'],
                    'tax_amount' => $calculation['taxAmount']
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
                        'available_stock' => ($availableStock === 0) 
                                                ? 'sold out' 
                                                : $availableStock,
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
