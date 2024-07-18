<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\DealPipeline;
use App\Models\UserSetting;
use Auth;

class DealPipelinesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pipelines = DealPipeline::where('userId', $this->getMainUserId())
            ->get();
    
        $mainUserId = $this->getMainUserId();
        $settings = UserSetting::where('mainUserId', $mainUserId)->first();

        $data1 = [];
        foreach($pipelines as $pipeline){

            $stages = [];
            foreach($pipeline->stages as $stage){
                $data = [];
    
                foreach($stage->deals as $deal){
                    // Populate the data array with the deal information and additional settings
                    $contact = $deal->contact;
                    $data[] = [
                        'id' => $deal->id,
                        'aging' => $deal->aging,
                        'contactId' => $deal->contactId,
                        'stageId' => $deal->stageId,
                        'star' => $deal->star,
                        'pipelineId' => $deal->pipelineId,
                        'fullName' => $contact->fields['firstName'] . ' ' . $contact->fields['lastName'],
                        'dealCardpos2FieldValue' => $contact->fields[$settings->dealCardpos2FieldId] ?? "",
                        'dealCardpos2FieldName' => $settings->dealCardpos2FieldId,
                        'dealCardpos3FieldValue' => $contact->fields[$settings->dealCardpos3FieldId] ?? "",
                        'dealCardpos3FieldName' => $settings->dealCardpos3FieldId,
                        'dealCardpos4FieldValue' => $contact->fields[$settings->dealCardpos4FieldId] ?? "",
                        'dealCardpos4FieldName' => $settings->dealCardpos4FieldId,
                    ];
                }
    
                // Replace the deals in the stage with the new data array
                $stages[] = [
                    'id' => $stage->id,
                    'name' => $stage->name,
                    'deals' => $data,
                ];
            }

            $data1[] = [
                'id' => $pipeline->id,
                'name' => $pipeline->name,
                'stages' => $stages,
            ];
        }
    
        // Return the pipelines as JSON response
        return response()->json($data1, 200);
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

        $pipeline = DealPipeline::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $this->getMainUserId(), 
            ])
        );
        
        return response()->json($pipeline, 200);
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
        return DealPipeline::find($id)->delete();
    }
}
