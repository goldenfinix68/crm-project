<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = new Activity();
        if ($request->search) {
            $data = $data->where(function ($q) use ($request) {
                $q->orWhere('job_purpose', 'LIKE', "%$request->search%");
            });
        }

        if (isset($request->status)) {
            $data = $data->where('status', $request->status);
        }

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "column") {
                    //
                } else {
                    $data = $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data = $data->orderBy('id', 'asc');
        }

        if ($request->page_size) {
            $data = $data->limit($request->page_size)
                ->paginate($request->page_size, ['*'], 'page', $request->page)
                ->toArray();
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'request' => $request->all()
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

        $data = Activity::updateOrCreate([
            'id' => $request->id
        ], [
            'job_purpose' => $request->job_purpose,
        ]);

        return response()->json([
            'success' => true,
            'data' =>  $data
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Activity  $Activity
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Activity::find($id);
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Activity  $Activity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $update_query = Activity::find($id);

        $updated_result = $update_query->fill($request->all());
        $updated_result = $updated_result->save();

        if ($updated_result)
            return response()->json([
                'success'       => true,
                'message'       => 'Success',
                'description'   => 'Data updated successfully'
            ], 200);
        else
            return response()->json([
                'success'       => false,
                'message'       => 'Error',
                'description'   => 'Data not updated'
            ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Activity  $Activity
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $data = Activity::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 400);
        } else {
            // \App\EventTag::where('tag', $device->sport)->delete();
            // \App\AthleteOrganization::where('sport', $device->sport)->update(['sport' => '']);
            // \App\CoachOrganization::where('sport', $device->sport)->update(['sport' => '']);
            // \App\AthleteWebsite::where('sport', $device->sport)->update(['sport' => '']);
        }

        if ($data->delete()) {
            return response()->json([
                'success' => true
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Data could not be deleted'
            ], 500);
        }
    }
}
