<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Text;
use App\Models\User;
use Auth;
use Carbon\Carbon;
use App\Jobs\SendText;
use App\Events\TextReceived;
use App\Business\Pusher;

use App\Services\UserService;
use App\Services\TextService;

class TextsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Text::orderBy('id', 'desc')->get();
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
        $validator = Validator::make($request->all(), [
            'from' => 'required',
            'to' => 'required',
            'message' => 'required',
        ]);
        
        $userId = Auth::id();

        try {
            if(empty($request->schedule)){

                $text = Text::create(array_merge($request->all(), [
                    'userId' => $userId, 
                    'type'=> 'SMS', 
                    'status' => 'queued',
                    'isFromApp' => true,
                    "to" => $request->to,
                ]));

                SendText::dispatch($text);
            }
            else{
                $givenTime = strtotime($request->schedule);
                $currentTime = time();
                $fiveMinutesFromNow = $currentTime + (5 * 60);
                if ($givenTime >= $currentTime && $givenTime <= $fiveMinutesFromNow) {
                    $text = Text::create(array_merge($request->all(), [
                        'userId' => $userId, 
                        'type'=> 'SMS', 
                        'status' => 'scheduled',
                        'isFromApp' => true,
                        'queueLock' => true,
                        "to" => $request->to,
                    ]));
                    $timeStartSeconds = $givenTime - $currentTime;
                    $delayInSeconds = $timeStartSeconds + 1;
					SendText::dispatch($text)->delay($delayInSeconds);
                } else {
                    $text = Text::create(array_merge($request->all(), [
                        'userId' => $userId, 
                        'type'=> 'SMS', 
                        'status' => 'scheduled',
                        'isFromApp' => true,
                        "to" => $request->to,
                    ]));
                }
            }

            
        } catch (\Exception $e) {
            dd($e);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
            // Handle any errors here
        }
        
        return response()->json([
            'success' => true,
            'message' => "Text sent"
        ], 200);
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

    public function textReceived(Request $request)
    {
        \Log::info('INCOMING TEXT SUCCESS');
        $json = json_decode(file_get_contents("php://input"), true);
        \Log::info($json);

        
        $text = new Text();
        $text->from = $json['from'];
        $text->to = $json['to'];
        $text->message = $json['body'];
        $text->type = "SMS";
        $text->status = 'received';
        $text->save();
        
        $mainUserIds = UserService::getMainUsersByMobile($text->to);
        
        $pusher = new Pusher();
        foreach($mainUserIds as $id){
            $user = User::find($id);
            $stopWordList = $user->settings->stopWordList;
            $stopWordList = explode("\n", $stopWordList);

            if(TextService::containsStopWord($text->message, $stopWordList)){
                $text->isSuppressed = true;
                $text->save();
            }
            else{
                $pusher->trigger('notif-channel-'.$id, 'notif-received-'.$id, [
                    'type' => 'text',
                    'message' => "Text from " . $text->sender,
                    'description' => $text->message,
                ]);
            }
        }
    }

    public function resend(Request $request)
    {
        $text = Text::find($request->id);

        if(empty($text)){
            abort(404);
        }
        $text->status = "queued";
        $text->save();
        
        SendText::dispatch($text);
        
        return response()->json([
            'success' => true,
            'message' => "Text queued.",
        ], 200);
    }
}
