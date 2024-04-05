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
use App\Services\MobileNumberService;
use App\Services\RoorService;

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

    
    public function call_history(Request $request)
    {
        $data = [];
        $dateString = str_replace(['"', '&quot;'], '', $request->dateFilter[0]);
        $dateFrom = Carbon::parse($dateString)->toDateTimeString();
        $dateString = str_replace(['"', '&quot;'], '', $request->dateFilter[1]);
        $dateTo = Carbon::parse($dateString)->toDateTimeString();

        $calls = Call::select('*')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->orderBy('id', 'desc')
            ->paginate($request->input('page_size', 20));

        foreach($calls->items() as $call){
            $data[] = $this->prepareCall($call);
        }
        
        return response()->json([
            'data' => $data,
            'total' => $calls->total(),
        ], 200);
    }

    public function prepareCall ($call) {
        $from = $call->from;
        $to = $call->to;
        $isFromApp = MobileNumber::where('mobileNumber', $from)->with('user')->first();
        $isToApp = MobileNumber::where('mobileNumber', $to)->with('user')->first();
        $contactNameFrom = "Not saved";
        $contactNameTo = "Not saved";
        if(empty($isFromApp)) {
            $contact = $this->getContactByMobile($from);
            if(!empty($contact)) {
                $contactNameFrom = $contact->fields['firstName'] . ' ' . $contact->fields['lastName'];
            }
        } else {
            $contactNameFrom = $isFromApp->user->fullName;
        }
        if(empty($isToApp)) {
            $contact = $this->getContactByMobile($to);
            if(!empty($contact)) {
                $contactNameTo = $contact->fields['firstName'] . ' ' . $contact->fields['lastName'];
            }
           
        } else {
            $contactNameTo = $isToApp->user->fullName;
        }
        

        return [
            'telnyxCallSessionId' => $call->telnyxCallSessionId,
            'dateTime' => $call->call_received_date,
            'type' => $call->type,
            'isFromApp' => $isFromApp,
            'isToApp' => $isToApp,
            'from' => $call->from,
            'to' => $call->to,
            'duration' => $call->duration,
            'outcome' => $call->status,
            'recording_url' => $call->url_recording ?? "",
            'from_formatted' => $from,
            'to_formatted' => $to,
            'contactNameFrom' => $contactNameFrom,
            'contactNameTo' => $contactNameTo,
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

    public function openPhoneImportAudio(Request $request) {
        // Validate the incoming file. Refuses anything bigger than 2048 kilobyes (=2MB)
        $request->validate([
            'audio' => 'nullable|file|mimes:audio/mpeg,mpga,mp3,wav,aac',
        ]);

        // Store the file in storage\app\public folder
        $file = $request->file('audio');
        $fileName = $file->getClientOriginalName();
        $filePath = $file->storeAs('uploads', $fileName,'public');

        // 2024-03-13T19_56_16+00_00+13034892316.mp3
        // $fileName = str_replace(['T', '+', '_'], [' ', ' ', ' '], $fileName);
        $fileName = explode('+', $fileName);
        $timeStamp = $fileName[0];
        $timeStamp = str_replace(['_'], [':'], $timeStamp);
        $timeStamp = str_replace(['T'], [' '], $timeStamp);

        $toNumber = $fileName[count($fileName) - 1];
        $toNumber = explode('.', $toNumber);
        $toNumber = $toNumber[0];


        $toNumber = MobileNumberService::formatPhoneNumber($toNumber);

        $url_recording = env('APP_URL').'/storage/'.$filePath;
        $call = \App\Models\Call::updateOrCreate([
            // 'from' => $request->from,
            'to' => $toNumber,
            'call_received_date' => $timeStamp,
        ],[
            'from' => '7207408070',
            'to' => $toNumber,
            'url_recording' => $url_recording,
            'telnyxCallSessionId' => '-',
            'status' => '-',
            'disposition' => '-',
            'duration' => '00:00:00',
            'type' => '',
            'call_received_date' => $timeStamp,
        ]);

        // // Store file information in the database
        // $uploadedFile = new UploadedFile();
        // $uploadedFile->filename = $fileName;
        // $uploadedFile->original_name = $file->getClientOriginalName();
        // $uploadedFile->file_path = $filePath;
        // $uploadedFile->save();
        return response()->json([
            'success' => true,
            'data' => $call,
        ], 200);
    }
    
    public function roorInitiateCall(Request $request)
    {
        $this->validate($request, [
            'agentNumber' => 'required',
            'callerNumber' => 'required',
            'destinationNumber' => 'required',
        ]);

        $result = RoorService::initiateCall($request->callerNumber, $request->destinationNumber, $request->agentNumber);

        return response()->json([
            'success' => true,
            'data' => $result,
        ], 200);
    }
}


