<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\GetPublicImageId;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

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
        $products = Product::all();

        return response()->json([
            'status' => 'success',
            'message' => 'Products retrieved successfully.',
            'data' => [
                'products' => $products
            ]
        ], 200);
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
            'image_url' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],
            'stock_quantity' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('image_url')) {
            $result = Cloudinary::uploadApi()->upload($request->file('image_url')->getRealPath(), [
                'folder'    => 'products',
            ]);

            $fields['image_url'] = $result["secure_url"];
        }

        $product = $request->user()->products()->create($fields);

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully.',
            'data' => [
                'product' => $product
            ]
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Product retrieved successfully.',
            'data' => [
                'product' => $product
            ]
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, GetPublicImageId $calculator)
    {
        $fields = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric'],
            'image_url' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],
            'stock_quantity' => ['nullable', 'integer'],
        ]);

        $product = Product::findOrFail($id);

        if ($request->hasFile('image_url')) {
            $publicId = $calculator->getPublicImageId($product->image_url);

            // delete the old image first
            Cloudinary::uploadApi()->destroy($publicId, [
                'invalidate' => true,
            ]);

            // then add the new one
            $result = Cloudinary::uploadApi()->upload($request->file('image_url')->getRealPath(), [
                'folder'    => 'products',
            ]);

            $fields['image_url'] = $result["secure_url"];
        }

        $product->update($fields);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully.',
            'data' => [
                'product' => $product
            ]
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, GetPublicImageId $calculator)
    {
        $product = Product::findOrFail($id);

        if ($product->image_url) {
            $publicId = $calculator->getPublicImageId($product->image_url);

            Cloudinary::uploadApi()->destroy($publicId, [
                'invalidate' => true,
            ]);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully.'
        ], 200);
    }
}
