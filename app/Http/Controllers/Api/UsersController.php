<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\MobileNumber;
use App\Models\CustomFieldValue;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Telnyx\Telnyx;
use Auth;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::with('numbers')->get();
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

        $user->telnyxConnectionId = $request->sipTrunkingConnection['telnyxConnectionId'];
        $user->telnyxConnectionName = $request->sipTrunkingConnection['telnyxConnectionName'];
        $user->telnyxConnectionUserName = $request->sipTrunkingConnection['telnyxConnectionUserName'];
        $user->telnyxConnectionPassword = $request->sipTrunkingConnection['telnyxConnectionPassword'];
        $user->save();

        $mobileNumbers = collect($request->sipTrunkingConnection['numbers'])->pluck('mobileNumber')->toArray();
        
        foreach($mobileNumbers as $number){
            $isExisting = MobileNumber::where('mobileNumber', $number)->where('userId', $user->id)->first();
            if(empty($isExisting)){
                $newMobile = new MobileNumber();
                $newMobile->userId = $user->id;
                $newMobile->mobileNumber = $number;
                $newMobile->save();
            }
        }
        $user->numbers()->whereNotIn('mobileNumber', $mobileNumbers)->delete();

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
        return User::with('numbers')->find($id);
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

    public function usedTags()
    {
        $user = Auth::user();

        if(empty($user)){
            abort(404);
        }

        
        $tags = CustomFieldValue::select('lookupIds')->with(['customField'])
                    ->whereNotNull('lookupIds')
                    ->whereHas('customField', function ($query) use ($user) {
                        $query->where('userId', $user->id);
                        $query->where('type', 'tag');
                    })
                    ->distinct()
                    ->get();

        $resultArray = [];
        foreach ($tags as $item) {
            $decodedData = json_decode($item->lookupIds, true);
            
            if (is_array($decodedData)) {
                $resultArray = array_merge($resultArray, $decodedData);
            } 
        }
    
        $uniqueResultArray = array_values(array_unique($resultArray));

        return response()->json($uniqueResultArray, 200);
    }
}
