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

        $items = $cartItems->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_price' => $item->product->price,
                'product_quantity' => $item->quantity,
                'product_subTotal' => $item->product->price * $item->quantity 
            ];
        });

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
        ]);
    }

    public function cashCheckout(Request $request) {
        $request->validate([
            'payment_method' => ['required', 'in:cash']
        ]);

        $cartItems = Cart::where('user_id', $request->user()->id)
                        ->with('product')
                        ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'There are no products in cart.'
            ], 404);
        }

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

        Order::create([
            'user_id' => $request->user()->id,
            'payment_method' => $request->payment_method,
            'total_price' => $total,
            'sub_total_price' => $subTotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount
        ]);
        
        $order = Order::with('orderproducts')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Cash checkout completed successfully.',
            'data' => [
                'order' => $order
            ]
        ]);
    }

    public function qrCheckout(Request $request) {
        $request->validate([
            'payment_method' => ['required', 'in:khqr']
        ]);

        return 'khqr';
    }