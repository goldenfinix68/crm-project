<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\DealNote;
use App\Models\DealFile;
use App\Models\DealFavorite;
use App\Models\ContactUpdate;
use App\Models\UserSetting;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Auth;

class DealsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
       
        if(empty($request->pipelineId)){
            return response()->json([], 200);
        }

        $mainUserId = $this->getMainUserId();
            
        $deals = Deal::with(['pipeline', 'stage'])
            ->where('pipelineId', $request->pipelineId)
            ->whereHas('pipeline', function ($query) use($mainUserId) {
                $query->where('userId', $mainUserId);
            })
            ->orderBy('star','desc')
            ->paginate($request->page_size);
            
        $settings = UserSetting::where('mainUserId', $mainUserId)->first();

        // dd($settings->dealCardpos2FieldId);

        $data = [];
        foreach($deals->items() as $deal){
            $data[] = [
                'id' => $deal->id,
                'pipeline' => $deal->pipeline,
                'stage' => $deal->stage,
                'aging' => $deal->aging,
                'contactId' => $deal->contactId,
                'stageId' => $deal->stageId,
                'star' => $deal->star,
                'pipelineId' => $deal->pipelineId,
                'fullName' => $deal->fullName,
                'dealCardpos2FieldValue' => $deal->contact->fields[$settings->dealCardpos2FieldId] ?? "",
                'dealCardpos2FieldName' => $settings->dealCardpos2FieldId,
                'dealCardpos3FieldValue' => $deal->contact->fields[$settings->dealCardpos3FieldId] ?? "",
                'dealCardpos3FieldName' => $settings->dealCardpos3FieldId,
                'dealCardpos4FieldValue' => $deal->contact->fields[$settings->dealCardpos4FieldId] ?? "",
                'dealCardpos4FieldName' => $settings->dealCardpos4FieldId,
            ];
        }


        return response()->json($data, 200);
    }

    /**
     * Get deals by stage.
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function dealsByStageId(Request $request)
    {
        if(empty($request->pipelineId)){
            return response()->json([], 200);
        }

        $mainUserId = $this->getMainUserId();
            
        $deals = Deal::with(['contact'])
            ->where('pipelineId', $request->pipelineId)
            ->where('stageId', $request->stageId)
            ->whereHas('contact', function ($query) use($mainUserId) {
                $query->where('userId', $mainUserId);
            })
            ->orderBy('star','desc')
            ->paginate($request->page_size);
            
        $settings = UserSetting::where('mainUserId', $mainUserId)->first();

        $data = [];
        foreach($deals->items() as $deal){
            $data[] = [
                'id' => $deal->id,
                'aging' => $deal->aging,
                'contactId' => $deal->contactId,
                'star' => $deal->star,
                'fullName' => $deal->fullName,
                'dealCardpos2FieldValue' => $deal->contact->fields[$settings->dealCardpos2FieldId] ?? "",
                'dealCardpos2FieldName' => $settings->dealCardpos2FieldId,
                'dealCardpos3FieldValue' => $deal->contact->fields[$settings->dealCardpos3FieldId] ?? "",
                'dealCardpos3FieldName' => $settings->dealCardpos3FieldId,
                'dealCardpos4FieldValue' => $deal->contact->fields[$settings->dealCardpos4FieldId] ?? "",
                'dealCardpos4FieldName' => $settings->dealCardpos4FieldId,
            ];
        }


        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $user = Auth::user();

        if(!empty($request->dealIds)){
            foreach($request->dealIds as $id){
                $data = Deal::find($id);
                
                //log deal update
                $update = new ContactUpdate();
                $update->userId = Auth::id();
                $update->title = "Deal updated";
                $update->logable_type = "deal";
                $update->contactId = $data->contactId;
                $update->from = $data->pipeline->name . ' - ' . $data->stage->name;

                $data->pipelineId = $request->pipelineId;
                $data->agingStartDate = $data->stageId != $request->stageId ? Carbon::now() : $data->agingStartDate;
                $data->stageId = $request->stageId;
                $data->save();

                
                $data = Deal::find($id);
                $update->to = $data->pipeline->name . ' - ' . $data->stage->name;
                $update->save();
            }
        }
        else{

            if(empty($request->id)){
                $existingDeal = Deal::where('contactId', $request->contactId)->first();
                if(!empty($existingDeal)){
                    return response()->json(['success' => false, 'message' => "Deal already exist."], 400);
                }

                $data = new Deal;
                $data->agingStartDate = Carbon::now();
                $data->createdByUserId = $user->id;
            }
            else{
                $data = Deal::find($request->id);
                $data->agingStartDate = $data->stageId != $request->stageId ? Carbon::now() : $data->agingStartDate;

                //log deal update
                $update = new ContactUpdate();
                $update->userId = $user->id;
                $update->title = "Deal Updated";
                $update->contactId = $data->contactId;
                $update->from = $data->pipeline->name . ' - ' . $data->stage->name;
                $update->logable_type = "deal";

            }
            
            $data->contactId = $request->contactId;
            $data->pipelineId = $request->pipelineId;
            $data->stageId = $request->stageId;
            $data->save();

            if(!empty($update)){
                $data = Deal::find($request->id);
                $update->to = $data->pipeline->name . ' - ' . $data->stage->name;
                $update->save();
            }
        }

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Deal::with(['owner', 'activities.owner', 'notes.user', 'files.uploaded_by', 'participant.user', 'contact.type', 'teammate.user'])->find($id);
        $notes = \App\Models\DealNote::with('user')->where('deal_id', $id)->where('is_pinned', '1')->get();
        return response()->json(['success' => true, 'data' => $data, 'notes' => $notes], 200);
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

    public function useDealUpdateBoardMutation(Request $request)
    {

        $datas = $request->lanes;
        // $cards = [];
        // foreach ($data as $key => $val) {
        //     array_push($cards,  $val);
        // }

        foreach ($datas as $data) {
            $find = Deal::find($data['id']);
            // dd($find->stageId, $data['laneId']);
            $find->agingStartDate =  $find->stageId != $data['laneId'] ? Carbon::now() : $find->agingStartDate;
            $find->stageId = $data['laneId'];
            $find->save();
        }

        return response()->json(['success' => false, 'data' => $datas], 200);
    }

    public function moveCardAcrossLanes(Request $request)
    {

        $deal = Deal::find($request->dealId);
       
        if(empty($deal) || empty($request->stageId)){
            abort(404);
        }


        //log deal update
        $update = new ContactUpdate();
        $update->userId = Auth::id();
        $update->title = "Deal updated";
        $update->logable_type = "deal";
        $update->contactId = $deal->contactId;
        $update->from = $deal->pipeline->name . ' - ' . $deal->stage->name;
        

        $stage = \App\Models\DealPipelineStage::find($request->stageId);
        $deal->pipelineId = $stage->dealPipelineId;
        $deal->agingStartDate = $deal->stageId != $request->stageId ? Carbon::now() : $deal->agingStartDate;
        $deal->stageId = $request->stageId;
        $deal->save();
        
        
        $deal = Deal::find($request->dealId);
        $update->to = $deal->pipeline->name . ' - ' . $deal->stage->name;
        $update->save();

        return response()->json(['success' => false, 'data' => $deal], 200);
    }

    public function update_stage(Request $request)
    {
        $data = Deal::find($request->id);
        $data->stage = $request->stage;
        $data->save();

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function multi_delete(Request $request)
    {
        $data = Deal::whereIn('id', $request->deals_id)->delete();
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function multi_update(Request $request)
    {
        $data = Deal::whereIn('id', $request->deals_id)->get();

        foreach ($data as $key => $val) {
            $val[$request->val['name']] = $request->val['value'];
            $val->save();
        }

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function starred(Request $request) {
        $deal = Deal::find($request->id);
        $deal->star = $deal->star == 0 ? 1 : 0;
        $deal->save();

        return response()->json(['success' => true, 'data' => $deal], 200);
    }
}
