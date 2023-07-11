<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (auth()->attempt($credentials)) {
            $token = auth()->user()->createToken('CRMPROJECT')->accessToken;

            return response()->json(['access_token' => $token, 'user' => auth()->user()], 200);
        } else {
            return response()->json(['error' => 'Username or Password is Invalid', 'data' => $credentials], 401);
        }
    }


    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    
    public function signup (){
        
    }
}
