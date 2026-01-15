<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'imageUrl' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],
            'stock_quantity' => ['required', 'integer'],
        ]);

        if ($request->hasFile('imageUrl')) {
            $path = $request->file('imageUrl')->store('products', 'public');
            $fields['imageUrl'] = $path;
        }

        $product = Product::create($fields);

        return response()->json([
            'message' => 'Created product successfully!',
            'product' => $product,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::where('id', $id)->get();

        return $product;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $fields = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'imageUrl' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],
            'stock_quantity' => ['required', 'integer'],
        ]);

        $product = Product::findOrFail($id);

        if ($request->hasFile('imageUrl')) {
            if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
                Storage::disk('public')->delete($product->imageUrl);
            }

            $path = $request->file('imageUrl')->store('products', 'public');
            $fields['imageUrl'] = $path;
        }

        $product->update($fields);

        return response()->json([
            'message' => 'Updated product successfully!',
            'product' => $product,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return [
            'message' => 'Deleted product successfully!',
            'product' => $product,
        ];
    }
}
