<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\DealNote;
use App\Models\DealFile;
use App\Models\DealFavorite;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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

        $data = Deal::select([
            'deals.*',
            DB::raw('(SELECT CONCAT(firstName," ",lastName) FROM contacts WHERE contacts.id = deals.contactId) As contact_name'),
            DB::raw('(SELECT CONCAT(firstName," ",lastName) FROM users WHERE users.id = deals.owner) As owner_name'),
        ])->where(function ($q) use ($request) {
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
        })->with(['owner', 'activities.owner', 'notes.user', 'files.uploaded_by', 'participant.user', 'contact', 'teammate.user']);

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
        $voa = Deal::where('stage', 'Verbal Offer Accepted')->sum('value');
        $uc = Deal::where('stage', 'Under Contract')->sum('value');
        $count = Deal::count();
        $sum_upp = Deal::sum('value');

        $deal_favorite = DealFavorite::where('user_id', auth()->user()->id)->get();
        return response()->json(['success' => true, 'data' => $data, 'deal_favorite' =>   $deal_favorite, 'sum' => [
            'cq' => $cq,
            'fg' => $fg,
            'in' => $in,
            'voa' => $voa,
            'uc' => $uc,
            'count' => $count,
            'sum_upp' => $sum_upp,

        ]], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {


        $data = Deal::updateOrCreate(['id' => $request->id], $request->except('teamateLocal', 'particapantLocal'));
        $data->sort = $data->id;
        $data->save();

        if ($request->id == 0) {
            foreach ($request->teamateLocal as $key => $val) {
                $team = \App\Models\DealTeammate::updateOrCreate(
                    ['deal_id' => $data->id, 'user_id' => $val['id']],
                    ['deal_id' => $data->id, 'user_id' => $val['id']],
                );
            }
            foreach ($request->particapantLocal as $key => $val) {
                $participant = \App\Models\DealParticipant::updateOrCreate(
                    ['deal_id' => $data->id, 'user_id' => $val['id']],
                    ['deal_id' => $data->id, 'user_id' => $val['id']],
                );
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

    public function add_notes(Request $request)
    {

        $data = DealNote::updateOrCreate(
            ['id' => isset($request->id) ? $request->id : 0],
            [
                'notes' => $request->notes,
                'deal_id' => $request->deal_id,
                'user_id' => auth()->user()->id
            ]
        );

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function delete_notes(Request $request)
    {
        $data = DealNote::find($request->id);
        $data->delete();

        return response()->json(['success' => true, 'data' => $data], 200);
    }
    public function delete_activity(Request $request)
    {
        $data = \App\Models\Activity::find($request->id);
        $data->delete();

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function delete_file(Request $request)
    {
        $data = \App\Models\DealFile::find($request->id);
        $data->delete();

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function add_participant(Request $request)
    {


        $data = \App\Models\DealParticipant::updateOrCreate(
            ['deal_id' => $request->deal_id, 'user_id' => $request->user_id],
            ['deal_id' => $request->deal_id, 'user_id' => $request->user_id],
        );


        return response()->json(['success' => true, 'data' => $data], 200);
    }
    public function delete_participant(Request $request)
    {
        $data = \App\Models\DealParticipant::find($request->id);
        $data->delete();
        return response()->json(['success' => true, 'data' => $data], 200);
    }



    public function add_teammate(Request $request)
    {
        $data = \App\Models\DealTeammate::updateOrCreate(
            ['deal_id' => $request->deal_id, 'user_id' => $request->user_id],
            ['deal_id' => $request->deal_id, 'user_id' => $request->user_id],
        );


        return response()->json(['success' => true, 'data' => $data], 200);
    }
    public function delete_teammate(Request $request)
    {
        $data = \App\Models\DealTeammate::find($request->id);
        $data->delete();



        return response()->json(['success' => true, 'data' => $data], 200);
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
            array_push($cards,  $val);
        }

        foreach ($cards as $key => $val) {
            $find = Deal::find($val['id']);
            $find->stage = $val['laneId'];
            $find->sort = $key;
            $find->save();
        }

        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function won(Request $request)
    {
        $find = Deal::find($request->dealId);
        if ($request->action == "won") {
            $find->is_won = $request->isWon;
            $find->is_lost = $request->isLost;
            $find->estimated_close_date = $request->estimated_close_date;
        } else {
            $find->is_won = $request->isWon;
            $find->lost_reason = $request->lost_reason;
            $find->is_lost = $request->isLost;
            $find->estimated_close_date = $request->estimated_close_date;
        }

        $find->save();

        $data = DealNote::updateOrCreate(
            ['id' => isset($request->id) ? $request->id : 0],
            [
                'notes' => $request->notes,
                'deal_id' => $request->dealId,
                'user_id' => auth()->user()->id,
                'is_pinned' => "1"
            ]
        );

        return response()->json(['success' => true], 200);
    }

    public function add_files(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "File not saved",
        ];

        $category =  $request->category;

        if ((int) $request->files_count !== 0) {
            for ($i = 0; $i < $request->files_count; $i++) {
                $file = $request->file('files_' . $i);

                if ($file) {
                    $file_name =  $file->getClientOriginalName();
                    $file_size = $this->bytesToHuman($file->getSize());
                    $fileFilePath = Str::random(10)  . '.' . $file->getClientOriginalExtension();
                    $fileFilePathNew = $file->storeAs('uploads/delivery_requests', $fileFilePath, 'public');

                    $file_url = $file->storeAs(
                        'public/files',
                        time() . '_' . $file_name
                    );

                    $file_url = str_replace('public/files/', '', $file_url);
                    DealFile::create([
                        'deal_id' => $request->deal_id,
                        'file_size' => $file_size,
                        'file_name' => $file_name,
                        'file_url' => 'storage/' . $fileFilePathNew,
                        'uploaded_by' => auth()->user()->id
                    ]);
                }
            }



            $ret = [
                "success" => true,
                "message" => "Files saved successfully"
            ];
        }

        return response()->json($ret, 200);
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
    public function favorite(Request $request)
    {
        $data = DealFavorite::updateOrCreate(
            ['user_id' => auth()->user()->id, 'name' => $request->name],
            ['user_id' => auth()->user()->id, 'name' => $request->name]
        );
        return response()->json(['success' => true, 'data' => $data], 200);
    }
    public function del_favorite(Request $request)
    {
        $data = DealFavorite::where('user_id', auth()->user()->id)->where('name', $request->name)->delete();
        return response()->json(['success' => true, 'data' => $data], 200);
    }
}
