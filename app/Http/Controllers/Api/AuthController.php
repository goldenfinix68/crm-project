<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;

class AuthController extends Controller
{
    public function login (Request $request){
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        dd($credentials);

        if (auth()->attempt($credentials)) {
            if(auth()->user()->role == 'Admin') {
                if(auth()->user()->active == 1) {
                    $token = auth()->user()->createToken('CRMPROJECT')->accessToken;
                    $data = ['token' => $token,'data' => auth()->user()];
                    return response()->json($data, 200);
                } else {
                    return response()->json(['error' => 'Username or Password is Invalid', 'data' => $credentials], 401);    
                }
            } else {
                return response()->json(['error' => 'Username or Password is Invalid', 'data' => $credentials], 401);
            }
            
            
        } else {
            return response()->json(['error' => 'Username or Password is Invalid', 'data' => $credentials], 401);
        }
    }
    
    public function lgout (){
        
    }

    
    public function signup (){
        
    }
}
