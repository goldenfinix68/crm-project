<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityCustomField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityCustomFieldController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = new ActivityCustomField;
        if (isset($request->activity_id)) {
            $data = $data->select([
                'activity_custom_fields.*',
                DB::raw("(SELECT activity_custom_field_values.values FROM `activity_custom_field_values` WHERE activity_custom_field_values.activity_custom_fields_id=activity_custom_fields.id AND activity_custom_field_values.activity_id=".$request->activity_id.") as `value`"),
            ]);
        }
        $data = $data->where('status', 1);
        $data = $data->get();

        return response()->json([
            'success' => true,
            'data' =>  $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = ActivityCustomField::updateOrCreate([
            'id' => $request->id
        ], [
            'type' => $request->type,
            'label' => $request->label,
            'name' => $request->name,
            'section' => $request->section_name,
            'required' => $request->required,
        ]);

        if (isset($request->values)) {
            $data->values = $request->values;
        }

        if (isset($request->values_option)) {
            $data->values_option = $request->values_option;
        }

        $data->save();

        return response()->json([
            'success' => true,
            'data' =>  $data
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ActivityCustomField  $activityCustomField
     * @return \Illuminate\Http\Response
     */
    public function show(ActivityCustomField $activityCustomField)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ActivityCustomField  $activityCustomField
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ActivityCustomField $activityCustomField)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ActivityCustomField  $activityCustomField
     * @return \Illuminate\Http\Response
     */
    public function destroy(ActivityCustomField $activityCustomField)
    {
        //
    }
}
