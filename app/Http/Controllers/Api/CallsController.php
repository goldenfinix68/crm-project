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
                    ->from('calls');
            })
            ->orderBy('id', 'desc')
            ->get();

        foreach($calls as $call){
            $data[] = $this->prepareCall($call);
        }
        
        return response()->json($data, 200);
    }

    public function prepareCall ($call) {
        $from = $call->from;
        $to = $call->to;
        $from = str_replace('+', '', $from);
        $from = str_replace(' ', '', $from);
        $from = str_replace('-', '', $from);

        $to = str_replace('+', '', $to);
        $to = str_replace(' ', '', $to);
        $to = str_replace('-', '', $to);
        $isFromApp = MobileNumber::where('mobileNumber', $from)->with('user')->first();
        $isToApp = MobileNumber::where('mobileNumber', $to)->with('user')->first();
        

        return [
            'telnyxCallSessionId' => $call->telnyxCallSessionId,
            'dateTime' => $call->call_received_date,
            'type' => $call->type,
            'isFromApp' => $isFromApp,
            'isToApp' => $isToApp,
            'from' => !empty($isFromApp) ? $isFromApp->user->fullName : $call->from,
            'to' => !empty($isToApp) ? $isToApp->user->fullName : $call->to,
            'duration' => $call->duration,
            'outcome' => $call->status,
            'recording_url' => $call->url_recording ?? "",
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
        $this->validate($request, [
            'from' => 'required',
            'to' => 'required',
            'url_recording' => 'required',
        ]);

        $call = \App\Call::updateOrCreate([
            'from' => $request->from,
            'to' => $request->to,
            'call_received_date' => $request->call_received_date,
        ],[
            'from' => $request->from,
            'to' => $request->to,
            'url_recording' => $request->url_recording,
            'status' => $request->status,
            'disposition' => $request->disposition,
            'duration' => $request->duration,
            'call_received_date' => $request->call_received_date,
        ]);
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
                'type' => 'call',
                'message' => "Call Information",
                'description' => 'Call '.str_replace('call.', "", $call->type).' from contact ' . $callDetails['contactName'] . ' to user ' . $callDetails['userName'],
            ]);
        }
    }


    public function roorCalls(Request $request)
    {
        $this->validate($request, [
            'from' => 'required',
            'to' => 'required',
            'url_recording' => 'required',
        ]);

        $call = \App\Call::updateOrCreate([
            'from' => $request->from,
            'to' => $request->to,
            'call_received_date' => $request->call_received_date,
        ],[
            'from' => $request->from,
            'to' => $request->to,
            'url_recording' => $request->url_recording,
            'status' => $request->status,
            'disposition' => $request->disposition,
            'duration' => $request->duration,
            'call_received_date' => $request->call_received_date,
        ]);
    }
}

