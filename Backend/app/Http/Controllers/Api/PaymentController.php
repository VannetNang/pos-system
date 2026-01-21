<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use KHQR\BakongKHQR;
use KHQR\Helpers\KHQRData;
use KHQR\Models\IndividualInfo;


class PaymentController extends Controller
{
    public function qrCheckout(Request $request) {
        $cartItems = Cart::where('user_id', $request->user()->id)
                        ->with('product')
                        ->get();

        $controller = new OrderController();

        [$taxRate, $taxAmount, $subTotal, $total] = $controller->calculation($cartItems);

        foreach ($cartItems as $item) {
            if ($item->quantity > $item->product->stock_quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Not enough stock for one or more products.',
                    'data' => [
                        'product_name' => $item->product->name,
                        'available_stock' => $item->product->stock_quantity
                    ],
                ]);
            }
        }

        Order::create([
            'user_id' => $request->user()->id,
            'payment_method' => 'khqr',
            'status' => 'pending',
            'total_price' => $total,
            'sub_total_price' => $subTotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount
        ]);

        $individualInfo = new IndividualInfo(
            bakongAccountID: config('bakong.account_id'),
            merchantName: config('bakong.merchant_name'),
            merchantCity: config('bakong.merchant_city'),
            currency: KHQRData::CURRENCY_KHR,
            amount: $total,
            storeLabel: config('bakong.store_label'),
            terminalLabel: config('bakong.terminal_label')
        );

        $response = BakongKHQR::generateIndividual($individualInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'KHQR QR Code retrived successfully.',
            'data' => [
                'order' => $cartItems,
                'qr' => $response->data['qr'],
                'md5' => $response->data['md5']
            ]
        ]);
    }

    public function verifyTransaction(Request $request){
        $request->validate([
            'md5' => ['required', 'string']
        ]);

        try {    
            $bakongKhqr = new BakongKHQR(config('bakong.token'));

            $response = $bakongKhqr->checkTransactionByMD5($request->md5);

            // if qr code is failed or not getting verified
            if ($response['responseCode'] !== 0) {
                return response()->json([
                    'status' => 'error',
                    'code' => $response['responseCode'],
                    'message' => $response['responseMessage'],
                ], 400);
            }

            // if success
            DB::transaction(function () use ($request) {
                $cartItems = Cart::where('user_id', $request->user()->id)
                        ->with(['product' => function ($query) {
                            // lock the product cause it contains stock quantity
                            // it makes sure: users can't checkout the same product at the same time
                            // else: it will cause overselling (stock_quantity = -1) 
                            $query->lockForUpdate();
                        }])
                        ->get();

                $order = Order::where('user_id', $request->user()->id)
                            ->where('status', 'pending')
                            ->where('payment_method', 'khqr')
                            ->firstOrFail();

                // attach data to order_product table
                foreach ($cartItems as $item) {
                    $order->products()->attach($item->product_id, [
                        'quantity' => $item->quantity,
                        'price_at_sale' => $item->product->price
                    ]);

                    // decrease the quantity from products DB
                    $item->product->decrement('stock_quantity',$item->quantity);
                }

                // update the status
                $order->update(['status' => 'completed']);

                // clear cart
                Cart::where('user_id', $request->user()->id)->delete();
            });
            
            return response()->json([
                'status' => 'success',
                'message' => 'Transaction verified successfully.',
                'data' => $response['data']
            ], 200);

        } catch (\Exception $error) {
            return response()->json([
                'status' => 'error',
                'message' => $error->getMessage()
            ], 500);
        }
    }
}
