<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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

        $token = $user->createToken($fields['name']);

        return response()->json([
            'message' => 'User created successfully!', 
            'user' => $user,
            'token' => $token->plainTextToken
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

        $token = $user->createToken($user->name);

        return response()->json([
            'message' => 'Login successfully!',
            'user' => $user,
            'token' => $token->plainTextToken
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully!'
        ], 200);
    }
}
