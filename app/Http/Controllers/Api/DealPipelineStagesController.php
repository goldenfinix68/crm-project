<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\DealPipelineStage;
use App\Models\DealPipeline;
use Auth;

class DealPipelineStagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $mainUserId = $this->getMainUserId();

        return DealPipelineStage::with(['pipeline'])
            ->whereHas('pipeline', function ($query) use($mainUserId) {
                $query->where('userId', $mainUserId);
            })
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
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        $data = $request->all();
        $pipeline = DealPipeline::find($data['dealPipelineId']);

        if($this->getMainUserId() != $pipeline->userId){
            abort(401);
        }
        //check highest sort
        $highestSort = DealPipelineStage::where('dealPipelineId', $pipeline->id)->orderBy('sort', 'desc')->first();

        $sort = 1;
        if(!empty($data['sort'])){
            $sort = $data['sort'];
        }
        else if(!empty($highestSort)){
            $sort = $highestSort->sort + 1;
        }

        $stage = DealPipelineStage::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $this->getMainUserId(), 
                'sort' => $sort,
            ])
        );

        
        return response()->json($stage, 200);
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
        return DealPipelineStage::find($id)->delete();
    }
    
    public function sort(Request $request)
    {
        foreach($request->all() as $index => $data){
            $stage = DealPipelineStage::find($data['id']);
            if(!empty($stage) && $stage->pipeline->userId == $this->getMainUserId()){
                $stage->sort = $index+1;
                $stage->save();
            }
        }

        return response()->json("Success", 200);
    }
}
