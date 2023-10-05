<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\MobileNumber;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Telnyx\Telnyx;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(empty($request->id)){
            $user = new User();
        }
        else{
            $user = User::find($request->id);
        }
        $user->firstName = $request->firstName;
        $user->lastName = $request->lastName;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);

        $user->save();

        foreach($request->numbers as $number){
            Telnyx::setApiKey(env('TELNYX_API_KEY'));
            $telnyxNumberDetails = \Telnyx\PhoneNumber::retrieve($number);
            $telnyxConnectionCreds = \Telnyx\CredentialConnection::retrieve($telnyxNumberDetails->connection_id);

            $isExisting = MobileNumber::where('mobileNumber', $number)->where('userId', $user->id)->first();
            if(empty($isExisting)){
                $newMobile = new MobileNumber();
                $newMobile->userId = $user->id;
                $newMobile->mobileNumber = $number;
                $newMobile->telnyxId = $telnyxNumberDetails->id;
                $newMobile->messagingProfileId = $telnyxNumberDetails->messaging_profile_id;
                $newMobile->connectionId = $telnyxNumberDetails->connection_id;
                $newMobile->sipTrunkUsername = $telnyxConnectionCreds->user_name;
                $newMobile->sipTrunkPassword = $telnyxConnectionCreds->password;
                $newMobile->save();
            }
        }
        $user->mobileNumbers()->whereNotIn('mobileNumber', $request->numbers)->delete();

        if(empty($request->id)){
            $user->markEmailAsVerified();
        }

        
        return response()->json($user, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
