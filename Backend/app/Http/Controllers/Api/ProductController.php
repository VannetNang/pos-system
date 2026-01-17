<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [ 
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // to get the creator info (user)
        // return Product::with('creator')->get();
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('modify', Product::class);

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

        $product = $request->user()->products()->create($fields);

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
        return Product::findOrFail($id);
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
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
            Storage::disk('public')->delete($product->imageUrl);
        }

        $product->delete();

        return response()->json([
            'message' => 'Deleted product successfully!',
        ], 200);
    }
}
