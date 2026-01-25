<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // show all products in cart
    public function index(Request $request) {
        $cart = Cart::where('user_id', $request->user()->id)
                    // specify column, instead of sending all data (using 'product')
                    ->with('product:id,name,description,price,stock_quantity,image_url')
                    ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Cart retrieved successfully.',
            'data' => [
                'carts' => $cart
            ]
        ], 200);
    }
    
    // add product to cart
    public function store(Request $request) {
        $request->validate([
            'product_id' => ['required'],
            'quantity' => ['nullable', 'min:1', 'integer']
        ]);

        // check existing product
        $cartItem = Cart::where('user_id', $request->user()->id)
                        ->where('product_id', $request->product_id)
                        ->first();

        // if found, increase the old quantity with new one
        if ($cartItem) {
            $newQuantity = $cartItem->quantity + ($request->quantity ?? 1);
        } else {
            $newQuantity = ($request->quantity ?? 1);
        }

        // check if the selected quantity > stock quantity
        $selectedProduct = Product::where('id', $request->product_id)
                                ->firstOrFail();

        if ($newQuantity > $selectedProduct->stock_quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not enough stock for one or more products.',
                    'data' => [
                        'product_name' => $selectedProduct->name,
                        'available_stock' => ($selectedProduct->stock_quantity === 0) 
                                                ? 'sold out' 
                                                : $selectedProduct->stock_quantity
                    ],
            ]);
        }

        // first array for unchanged data
        // second array for updating
        $cart = Cart::updateOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ], [
            'quantity' => $newQuantity
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product added to cart successfully.',
            'data' => [
                'cart' => $cart
            ]
        ], 201);
    }

    // show specific product in cart
    public function show(Request $request, string $id) {
        // find by user_id and product_id is more accurate and convenient than cart_id for front-end
        $cart = Cart::where('user_id', $request->user()->id)
                    ->where('product_id', $id)
                    ->with('product:id,name,description,price,stock_quantity,image_url')
                    ->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in cart.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Cart retrieved successfully.',
            'data' => [
                'cart' => $cart
            ]
        ], 200);
    }

    // decrease product quantity from the cart
    public function update(Request $request, string $id) {
        $request->validate([
            'quantity' => ['nullable', 'min:1', 'integer']
        ]);

        $cartItem = Cart::where('user_id', $request->user()->id)
                        ->where('product_id', $id)
                        ->first();

        // if cart not exist
        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in cart.'
            ], 404);
        }

        $newQuantity = $cartItem->quantity - ($request->quantity ?? 1);

        // if cart quantity below 0 after substracting, delete that cart
        if ($newQuantity <= 0) {
            $cartItem->delete();

            return response()->json([
                "status" => "success",
                "message" => "Product removed from cart."
            ], 200);
        }
        
        $cartItem->update(['quantity' => $newQuantity]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product quantity decreased.',
            'data' => [
                'cart' => $cartItem
            ]
        ], 200);
    }

    // delete product from the cart
    public function destroy(Request $request, string $id) {
        $cartItem = Cart::where('user_id', $request->user()->id)
                        ->where('product_id', $id)
                        ->first();

        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in cart.'
            ], 404);
        }

        $cartItem->delete();
        
        return response()->json([
            "status" => "success",
            "message" => "Product removed from cart.",
            "data" => [
                "product_id" => $id
            ]
        ], 200);
    }
}

