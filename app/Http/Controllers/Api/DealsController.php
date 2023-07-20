<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deal;

class DealsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Deal::orderBy('sort', 'asc')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {



        $data = Deal::create($request->all());
        $data->sort = $data->id;
        $data->save();


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

    public function useDealUpdateBoardMutation(Request $request)
    {

        $data = $request->lanes;
        $cards = [];
        foreach ($data as $key => $val) {
            foreach ($val['cards'] as $cardkey => $valkey) {
                array_push($cards,  $valkey);
            }
        }

        foreach ($cards as $key => $val) {
            $find = Deal::find($val['id']);
            $find->stage = $val['laneId'];
            $find->sort = $key;
            $find->save();
        }

        return response()->json(['success' => true, 'data' => $data], 200);
    }
}
