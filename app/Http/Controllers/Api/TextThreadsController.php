<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TextThread;
use App\Models\Text;
use Auth;

class TextThreadsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();

        if(empty($user)){
            abort(401, 'Unauthorized');
        }

        return TextThread::with(['texts'])->whereIn('userNumber', $user->numbers)->orderBy('id', 'desc')->get();
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return TextThread::with(['texts'])->where('id', $id)->first();
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
        $thread = TextThread::find($id);

        if(empty($thread)){
            abort(404, 'Thread not found');
        }

        $thread->delete();
        
        return response()->json(['success' => true]);
    }

    public function assign_label($id, Request $request)
    {
        $thread = TextThread::find($id);
        $thread->textLabelId = $request->textLabelId;
        $thread->save();

        return $thread;

    }
    
    public function mark_texts_seen(Request $request)
    {
        $thread = TextThread::find($request->threadId);

        if (!$thread) {
            return response()->json(['error' => 'Thread not found'], 404);
        }

        // Update all texts for the contact where seen_at is null
        Text::where('threadId', $thread->id)
            ->whereNull('seen_at')
            ->update(['seen_at' => now()]); // Set seen_at to the current timestamp

        return response()->json(['success' => true]);
    }
}
