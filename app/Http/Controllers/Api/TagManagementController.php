<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TagManagement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = new TagManagement();
        $data = $data->with([]);
        $data = $data->select([
            'tag_management.*',
        ]);

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
        $data = TagManagement::updateOrCreate([
            'id' => $request->id
        ], [
            'tag_name' => isset($request->tag_name) ? $request->tag_name : null,
        ]);

        return response()->json([
            'success' => true,
            'data' =>  $data
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TagManagement  $tagManagement
     * @return \Illuminate\Http\Response
     */
    public function show(TagManagement $tagManagement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TagManagement  $tagManagement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TagManagement $tagManagement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TagManagement  $tagManagement
     * @return \Illuminate\Http\Response
     */
    public function destroy(TagManagement $tagManagement)
    {
        //
    }
}
