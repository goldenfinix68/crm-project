<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Call;
use App\Models\Contact;
use App\Models\MobileNumber;
use Carbon\Carbon;
use DB;
use App\Business\Pusher;

class CallsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    
    public function call_history()
    {
        $data = [];
        $calls = Call::select('*')
            ->whereIn('id', function($query) {
                $query->select(DB::raw('MAX(id)'))
                    ->from('calls')
                    ->groupBy('telnyxCallSessionId');
            })
            ->orderBy('id', 'desc')
            ->get();

        foreach($calls as $call){
            $data[] = $this->prepareCall($call);
        }
        
        return response()->json($data, 200);
    }

    private function prepareCall ($call) {
        $callData = Call::where('telnyxCallSessionId', $call->telnyxCallSessionId)->get();
        $isFromApp = MobileNumber::where('mobileNumber', $call->from)->first();
        
        $contact = $this->getContactByMobile(!empty($isFromApp) ? $call->to : $call->from);

        $contactName = !empty($isFromApp) ? $call->to : $call->from;
        
        if(!empty($contact)){
            $contactName = $contact->fields['firstName'] . ' ' . $contact->fields['lastName'];
        }

        if(!empty($isFromApp)){
            $user = $isFromApp->user;
            $userName = $user->firstName . ' ' . $user->lastName;
        }
        else{
            $mobileNumnber = MobileNumber::where('mobileNumber', $call->to)->orderBy('id', 'desc')->first();
            if(!empty($mobileNumnber)){
                $userName = $user->firstName . ' ' . $user->lastName;
            }
            else{
                $userName = $call->to;
            }
        }

        $answeredData = $callData->where('type', 'call.answered')->first();
        $hangupData = $callData->where('type', 'call.hangup')->first();
        $isAnswered = !empty($answeredData) && !empty($hangupData);
        
        return [
            'telnyxCallSessionId' => $call->telnyxCallSessionId,
            'dateTime' => $call->created_at->format('M j, Y h:i a'),
            'isFromApp' => !empty($isFromApp),
            'contactName' => $contactName,
            'to' => $call->to,
            'from' => $call->from,
            'duration' => $isAnswered ? $hangupData->created_at->diffInSeconds($answeredData->created_at) : "0",
            'userName' => $userName,
        ];
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    
    public function webhook(Request $request)
    {
        \Log::info('INCOMING CALL SUCCESS');
        $json = json_decode(file_get_contents("php://input"), true);
        \Log::info($json);
        $payload = $json['data']['payload'];

        $call = new Call();
        $call->type = $json['data']['event_type'];
        $call->telnyxCallSessionId = $payload['call_session_id'];
        $call->from = $payload['from'];
        $call->to = $payload['to'];
        $call->telnyxResponse = json_encode($json);
        $call->save();

        $callDetails = $this->prepareCall($call);

        $isFromApp = MobileNumber::where('mobileNumber', $call->from)->first();
        
        if(!empty($isFromApp)){
            $mainUser = $isFromApp->user->mainUser;
        }
        else{
            $mainUser = MobileNumber::where('mobileNumber', $call->to)->first()->user->mainUser;
        }

        if(in_array($call->type, ['call.initiated', 'call.answered', 'call.hangup'])){
            $pusher = new Pusher();
            $pusher->trigger('notif-channel-'.$mainUser->id, 'notif-received-'.$mainUser->id, [
                'message' => "Call Information",
                'description' => 'Call '.str_replace('call.', "", $call->type).' from contact ' . $callDetails['contactName'] . ' to user ' . $callDetails['userName'],
            ]);
        }
    }
}
