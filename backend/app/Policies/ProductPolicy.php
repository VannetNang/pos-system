<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductPolicy
{
    public function modify(User $user): Response
    {
        return ($user->role === 'admin') 
            ? Response::allow() 
            : Response::deny('You do not have administrative permissions to perform this action.');
    }
}
