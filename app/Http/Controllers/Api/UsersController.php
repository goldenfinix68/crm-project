<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\MobileNumber;
use App\Models\CustomFieldValue;
use App\Models\UserSetting;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\TelnyxController;
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
    public function index(Request $request)
    {
        $user = Auth::user();
        if($user->role == "superAdmin"){
            $query = User::with(['numbers', 'mainUser']);

            // Apply search filter
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('firstName', 'like', '%' . $search . '%')
                        ->orWhere('lastName', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    // Add more fields as needed for searching
                });
            }
        
            // Apply pagination
            $perPage = $request->input('perPage', 10); // You can adjust the default perPage value
            $users = $query->paginate($perPage);
        
            return $users;
        }
        return User::where(function ($q) {
                    $q->where('id', $this->getMainUserId())
                        ->orWhere('mainUserId', $this->getMainUserId());
                })
                ->where('role', '!=', 'superAdmin')
                ->with('numbers')
                ->get();
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
        $authUser = Auth::user();
        if(empty($request->id)){
            $user = new User();
        }
        else{
            $user = User::find($request->id);
        }
        $lastUser = User::orderBy('id', 'desc')->first();


        $user->firstName = $request->firstName;
        $user->lastName = $request->lastName;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->mainUserId = $authUser->role == "superAdmin" ? $request->mainUserId : $authUser->id;
        $user->password = bcrypt($request->password);
        $user->sortCallForwarding = $lastUser ? $lastUser->id + 1 : 1;
        
        if($authUser->role == "superAdmin"){
            $user->telnyxConnectionId = $request->sipTrunkingConnection['telnyxConnectionId'];
            $user->telnyxConnectionName = $request->sipTrunkingConnection['telnyxConnectionName'];
            $user->telnyxConnectionUserName = $request->sipTrunkingConnection['telnyxConnectionUserName'];
            $user->telnyxConnectionPassword = $request->sipTrunkingConnection['telnyxConnectionPassword'];
            $user->save();
    
            foreach($request->sipTrunkingConnection['numbers'] as $number){
                $isExisting = MobileNumber::where('mobileNumber', $number['mobileNumber'])->where('userId', $user->id)->first();
                if(empty($isExisting)){
                    $newMobile = new MobileNumber();
                    $newMobile->userId = $user->id;
                    $newMobile->mobileNumber = $number['mobileNumber'];
                    $newMobile->telnyxMobileId = $number['id'];
                    $newMobile->save();
                }
            }
            $mobileNumbers = collect($request->sipTrunkingConnection['numbers'])->pluck('mobileNumber')->toArray();
            $user->numbers()->whereNotIn('mobileNumber', $mobileNumbers)->delete();
    
        }
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
        $user = User::where('id', $id)->first();
        $user->numbers = $this->getMainUserNumbers(true);

        return $user;
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

        $mainUserId = $this->getMainUserId();
        
        $tags = CustomFieldValue::select('lookupIds')->with(['customField'])
                    ->whereNotNull('lookupIds')
                    ->whereHas('customField', function ($query) use ($mainUserId) {
                        $query->where('userId', $mainUserId);
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

    public function callForwarding(Request $request)
    {
        $telnyxController = new TelnyxController();


        foreach($request->users as $user){
            $savedUser = User::find($user['id']);
            $forwardTo = User::find($user['forwardTo']);
            $errors = [];
            if(!empty($savedUser->number) && !empty($forwardTo->number)){
                $numberId = $savedUser->number->telnyxMobileId;

                $result = $telnyxController->updateCallForwardingType($numberId, $user['forwardingType'], $forwardTo->number->mobileNumber);
                $errors[] = $result;
                $savedUser->forwardingType = $user['forwardingType'];
                $savedUser->forwardTo = $user['forwardTo'];
                $savedUser->save();
            }
           
        }
        return response()->json($errors, 200);
    }
    
    public function saveSettings(Request $request)
    {
        $mainUserId = $this->getMainUserId();

        $setting = UserSetting::where('mainUserId', $mainUserId)->first();

        if (empty($setting)) {
            $setting = new UserSetting;
            $setting->mainUserId = $mainUserId; 
        }

        $setting->dealCardpos2FieldId = $request->dealCardpos2FieldId;
        $setting->dealCardpos3FieldId = $request->dealCardpos3FieldId;
        $setting->dealCardpos4FieldId = $request->dealCardpos4FieldId;

        $setting->save();

        return response()->json("Success", 200);
    }
}
