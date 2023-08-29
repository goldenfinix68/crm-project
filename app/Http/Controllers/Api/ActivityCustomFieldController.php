<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityCustomField;
use Illuminate\Http\Request;

class ActivityCustomFieldController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = new ActivityCustomField;
        $data = $data->where('status', 1)->get();

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
