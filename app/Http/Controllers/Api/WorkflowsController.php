<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workflow;
use App\Models\WorkflowItem;
use Illuminate\Support\Facades\Validator;
use Auth;
use Carbon\Carbon;
use DB;

class WorkflowsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $workflows = Workflow::where('userId', $this->getMainUserId())
            ->with(['items', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        // foreach($workflows as $workflow){
        //     foreach($workflow->items as $item){
        //         $item->related_texts = $item->texts;
        //     }
        // }

        return json_encode($workflows);
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
            'action' => 'required',
            'startOn' => 'required',
            'batchQuantity' => 'required',
            'repeatAfter' => 'required',
            'repeatAfterType' => 'required',
            'sendOn' => 'required',
            'startFrom' => 'required',
            'endsAt' => 'required',
            'message' => 'required',
            'contactIds' => 'required',
        ]);

        $data = $request->all();
        $workflow = Workflow::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $this->getMainUserId(), 
            ])
        );

        //save in items
        $workflowItems = WorkflowItem::where('workflowId', $workflow->id)->delete();

        $startOn = Carbon::parse($workflow->startOn)->format('Y-m-d');
        $startFrom = Carbon::parse($workflow->startFrom)->format('H:i:s');
        $endsAt = Carbon::parse($workflow->endsAt)->format('H:i:s');
        
        //means we can do this in 1 item
        if(count($workflow->contactIds) <= $workflow->batchQuantity){
            $workflowItem = new WorkflowItem();
            $workflowItem->workflowId = $workflow->id;
            $workflowItem->contactIds = $workflow->contactIds;
            $convertedToTimezone = Carbon::createFromFormat('Y-m-d H:i:s', $startOn, 'Asia/Manila');
            $convertedToTimezone->setTimezone(config('app.timezone'));
            $workflowItem->trigger_at = $convertedToTimezone->toDateTimeString();
            $workflowItem->save();
        }
        else{
            $contactIds = $workflow->contactIds;
            $isDone = false;
            $triggerTime = Carbon::parse($startOn);

            while (!$isDone) { 
                if (in_array($triggerTime->dayOfWeek, $workflow->sendOn)) {
                    $workflowItem = new WorkflowItem();
                    $workflowItem->workflowId = $workflow->id;
                    if(count($contactIds) <= $workflow->batchQuantity){
                        $workflowItem->contactIds = $contactIds;
                        $isDone = true;
                    }
                    else{
                        $workflowItem->contactIds = array_slice($contactIds, 0, $workflow->batchQuantity);
                        $contactIds = array_slice($contactIds, $workflow->batchQuantity);
                    }
                    $convertedToTimezone = Carbon::createFromFormat('Y-m-d H:i:s', $triggerTime, 'Asia/Manila');
                    $convertedToTimezone->setTimezone(config('app.timezone'));
                    $workflowItem->trigger_at = $convertedToTimezone->toDateTimeString();
                    $workflowItem->save();
                }
                switch ($workflow->repeatAfterType) {
                    case 'hours':
                        $triggerTime->addHours($workflow->repeatAfter);
                        break;
                    case 'days':
                        $triggerTime->addDays($workflow->repeatAfter);
                        break;
                    case 'minutes':
                        $triggerTime->addMinutes($workflow->repeatAfter);
                        break;
                    case 'seconds':
                        $triggerTime->addSeconds($workflow->repeatAfter);
                        break;
                }
                $checkTimeOnly = $triggerTime->format('H:i:s');
                if ($checkTimeOnly > $endsAt) {
                    $triggerTime->addDays(1);
                    $triggerTime = Carbon::parse($triggerTime->format('Y-m-d') . " " . $startFrom);
                }
            }
        }
        
        return response()->json($workflow, 200);
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
}
