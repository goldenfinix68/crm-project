<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Ui\Presets\React;

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
                // $q->orWhere('job_purpose', 'LIKE', "%$request->search%");
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
            'title' => isset($request->title) ? $request->title : null,
            'type' => isset($request->type) ? $request->type : null,
            'start_date' => isset($request->start_date) ? $request->start_date : null,
            'end_date' => isset($request->end_date) ? $request->end_date : null,
            'start_time' => isset($request->start_time) ? $request->start_time : null,
            'end_time' => isset($request->end_time) ? $request->end_time : null,
            'location' => isset($request->location) ? $request->location : null,
            'video_conferencing' => isset($request->video_conferencing) ? $request->video_conferencing : null,
            'recurrence' => isset($request->recurrence) ? $request->recurrence : null,
            'availability' => isset($request->availability) ? $request->availability : null,
            'internal_note' => isset($request->internal_note) ? $request->internal_note : null,
            'owner_id' => isset($request->owner_id) ? $request->owner_id : 0,
            'deal_id' => isset($request->deal_id) ? $request->deal_id : 0,
            'contact_id' => isset($request->contact_id) ? $request->contact_id : 0,
            // 'follower_id' => isset($request->follower_id) ? $request->follower_id : 0,
            'status' => 1,
        ]);


        if(isset($request->invitees) && count($request->invitees) > 0) {
            \App\Models\ActivityInvitee::where('activity_id', $data->id)->delete();

            $invitees = $request->invitees;
            foreach ($invitees as $key => $invitee) {
                \App\Models\ActivityInvitee::create([
                    'activity_id' => $data->id,
                    'full_name' => $invitee,
                    'from_id' => 0
                ]);
            }
        }

        if(isset($request->followers) && count($request->followers) > 0) {
            \App\Models\ActivityTag::where('activity_id', $data->id)->delete();

            $followers = $request->followers;
            foreach ($followers as $key => $follower) {
                \App\Models\ActivityFollower::create([
                    'activity_id' => $data->id,
                    'full_name' => $follower,
                ]);
            }
        }

        if(isset($request->tags) && count($request->tags) > 0) {
            \App\Models\ActivityTag::where('activity_id', $data->id)->delete();

            $tags = $request->tags;
            foreach ($tags as $key => $tag) {
                \App\Models\ActivityTag::create([
                    'activity_id' => $data->id,
                    'tag' => $tag,
                ]);
            }
        }


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


    public function get_user(Request $request) {
        $data = \App\Models\User::get();

        return response()->json([
            'success' => true,
            'data' => $data,
            'user_data' => auth()->user()
        ], 200);
    }
}
