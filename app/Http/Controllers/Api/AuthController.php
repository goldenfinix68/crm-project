<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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


    public function signup()
    { }

    public function forgotpassword_verify(Request $request)
    {
        return response()->json(['success' => true]);
    }


    public function forgotpassword(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $token = $user->createToken('CRMPROJECT')->accessToken;

            $to_name = $user->name;
            $to_email = $request->email;

            $data = array(
                'to_name' => $to_name,
                'to_email' => $to_email,
                'subject' => 'Speedclick Reset Password',
                'from_name' =>  'Speedclick Support',
                'from_email' => env('MAIL_FROM_ADDRESS'),
                'template' => 'admin.emails.password-reset',
                'body_data' => [
                    'link' => url('forgot-password-verify?token=' . $token),
                    'full_name' => $user->name,
                    'email' => $user->email,
                ]
            );


            event(new \App\Events\SendMailEvent($data));
            return response()->json(['success' => true], 200);
        } else {
            return response()->json(['success' => false, 'error' => 'Email Address Not Found']);
        }
    }


    public function forgot_password_set_password(Request $request)
    {
        $user = User::where('id', auth()->user()->id)->first();
        if ($user) {
            $user->password = Hash::make($request->password);
            if ($user->save()) {
                $token = $user->createToken('sunsetspa')->accessToken;
                return response()->json(['success' => true, 'data' => auth()->user(), 'token' => $token]);
            }
        } else {
            return response()->json(['success' => false, 'error' => 'Email Address Not Found'], 401);
        }
    }
}
