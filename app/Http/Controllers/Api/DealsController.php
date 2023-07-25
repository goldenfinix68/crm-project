<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deal;
use Carbon\Carbon;

class DealsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $end_of_date = Carbon::now()->lastOfMonth();
        $start_of_date = Carbon::now()->startOfMonth();
        $start_date = date('Y-m-d', strtotime($start_of_date));
        $end_date = date('Y-m-d', strtotime($end_of_date));

        $end_of_date_next = Carbon::now()->lastOfMonth()->addMonth();
        $start_of_date_next = Carbon::now()->startOfMonth()->addMonth();
        $start_date_next = date('Y-m-d', strtotime($start_of_date_next));
        $end_date_next = date('Y-m-d', strtotime($end_of_date_next));

        $data = Deal::where(function ($q) use ($request) {
            if ($request->search) {
                // $search = str_replace('%','[%]',$request->search);
                $search = $request->search;
                $q->where(\DB::raw('CONCAT(first_name," ",last_name)'), 'LIKE', "%$search%")
                    ->orWhere('role', 'LIKE', "%$search%")
                    // ->orWhere('COMPANY','LIKE',"%$search%")
                    ->orWhere('email', 'LIKE', "%$search%")
                    ->orWhere('username', 'LIKE', "%$search%")
                    ->orWhere('first_name', 'LIKE', "%$search%")
                    ->orWhere('last_name', 'LIKE', "%$search%")
                    ->orWhere(\DB::raw("(SELECT DATE_FORMAT(created_at, '%m/%d/%Y'))"), 'LIKE', "%$request->search%");
            }
        });

        if ($request->pipeline) {
            $data->where('pipeline', $request->pipeline);
        }
        if ($request->status == 'All Open Deals') {
            $data->where('status', 'Open');
        }
        if ($request->status == 'Deals Closing This Month') {
            $data = $data->where('estimated_close_date', '>=', $start_date)->where('estimated_close_date', '<=', $end_date);
        }
        if ($request->status == 'Deals Closing Next Month') {
            $data = $data->where('estimated_close_date', '>=', $start_date_next)->where('estimated_close_date', '<=', $end_date_next);
        }
        if ($request->status == 'Won Deals') {
            $data = $data->where('status', 'Won');
        }
        if ($request->status == 'Lost Deals') {
            $data =  $data->where('status', 'Lost');
        }


        if ($request->sort_order != '') {
            $data->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        } else {
            $data->orderBy('sort', 'asc');
        }

        if (isset($request->pagination)) {
            $data = $data->paginate($request->page_size);
        } else {
            $data = $data->get();
        }

        $cq = Deal::where('stage', 'Comp & Qualify')->sum('value');
        $fg = Deal::where('stage', 'First Offer Given')->sum('value');
        $in = Deal::where('stage', 'In Negotiation')->sum('value');
        $in = Deal::where('stage', 'Verbal Offer Accepted')->sum('value');
        $uc = Deal::where('stage', 'Verbal Offer Accepted')->sum('value');

        return response()->json(['success' => true, 'data' => $data], 200);
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
