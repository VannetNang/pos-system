<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request) {        
        $fields = $request->validate([
            'name' => ['required', 'min:2', 'max:255'],
            // unique:db_table,column  (no space)
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:2'],
            'role' => ['nullable', 'in:admin,staff']
        ]);

        $user = User::create($fields);

        $token = $user->createToken($fields['name'])->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => "Welcome, {$user->name}! Your account has been created.", 
            'data' => [
                'user' => $user,
                'token' => $token
            ]       
        ], 201);
    }

    public function login(Request $request) {
        $fields = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user) {
            return response()->json([
                'error' => 'Incorrect credential information!'
            ], 401);
        };

        $verifyPassword = Hash::check($fields['password'], $user->password);

        if (!$verifyPassword) {
            return response()->json([
                'error' => 'Incorrect credential information!'
            ], 401);
        };

        $token = $user->createToken($user->name)->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => "Hello {$user->name}, you are now logged in.",
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'You have been logged out.'
        ], 200);
    }

    public function deleteUser(Request $request, string $id) {
        Gate::authorize('modify', Product::class);

        $user = User::findOrFail($id);

        if ($request->user()->id == $id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Security check: You cannot delete your own administrator account.'
            ], 403);
        }

        $user->delete();

        // remove the token as well
        $user->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Staff member '{$user->name}' was successfully removed from the system."
        ]);
    }
}
